using System.Text.Json.Serialization;
using MathFrontier.Core.Interfaces;
using MathFrontier.Infrastructure.Data;
using MathFrontier.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Port binding for Render and local development
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// 2. Controllers & JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 3. Database configuration (SQLite for local / PostgreSQL for production)
var dbProvider = builder.Configuration["DATABASE_PROVIDER"]?.ToLower() ?? "sqlite";
var connectionString = builder.Configuration["DATABASE_CONNECTION_STRING"];

builder.Services.AddDbContext<MathFrontierDbContext>(options =>
{
    if (dbProvider == "postgresql" || dbProvider == "postgres")
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("DATABASE_CONNECTION_STRING must be configured for PostgreSQL.");
        }
        options.UseNpgsql(connectionString);
    }
    else
    {
        var sqliteConn = string.IsNullOrWhiteSpace(connectionString) ? "Data Source=mathfrontier.db" : connectionString;
        options.UseSqlite(sqliteConn);
    }
});

// 4. Dependency Injection
builder.Services.AddScoped<IProblemRepository, ProblemRepository>();
builder.Services.AddScoped<IWonderRepository, WonderRepository>();
builder.Services.AddScoped<IVisualizationRepository, VisualizationRepository>();
builder.Services.AddScoped<ITimelineRepository, TimelineRepository>();
builder.Services.AddScoped<ISearchService, SearchService>();

// 5. CORS Policy
var corsOriginsEnv = builder.Configuration["CORS_ORIGINS"];
var allowedOrigins = !string.IsNullOrWhiteSpace(corsOriginsEnv)
    ? corsOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    : new[] { "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://math-frontier-web.onrender.com" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("MathFrontierCors", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// 6. OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// 7. Database initialization and safe seeding
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<MathFrontierDbContext>();
        logger.LogInformation("Initializing database using provider: {Provider}", dbProvider);
        await DatabaseSeeder.SeedAsync(db);
        logger.LogInformation("Database initialization and seeding completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during database initialization or seeding.");
    }
}

// 8. HTTP pipeline configuration
app.MapOpenApi();

// Swagger UI endpoint
app.MapGet("/swagger", () => Results.Content("""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Math Frontier API — Interactive Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #020617; }
    .swagger-ui { filter: invert(88%) hue-rotate(180deg); }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi/v1.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ]
      });
    };
  </script>
</body>
</html>
""", "text/html"));

app.UseCors("MathFrontierCors");
app.UseAuthorization();
app.MapControllers();

app.Run();

// For integration tests
public partial class Program { }
