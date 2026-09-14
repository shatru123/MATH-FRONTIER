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
builder.Services.AddCors(options =>
{
    options.AddPolicy("MathFrontierCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
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
app.UseCors("MathFrontierCors");

// Serve frontend static files if present in wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

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

// Root route: if wwwroot/index.html exists, serve it; otherwise redirect to /swagger
app.MapGet("/", (IWebHostEnvironment env) =>
{
    var indexPath = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "index.html");
    if (File.Exists(indexPath))
    {
        return Results.File(indexPath, "text/html");
    }
    return Results.Redirect("/swagger");
});

app.UseAuthorization();
app.MapControllers();

// SPA client-side fallback
app.MapFallback((IWebHostEnvironment env) =>
{
    var indexPath = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "index.html");
    if (File.Exists(indexPath))
    {
        return Results.File(indexPath, "text/html");
    }
    return Results.NotFound(new
    {
        error = "Not Found",
        message = "Math Frontier API is active. Visit /swagger for interactive documentation or /health for service health."
    });
});

app.Run();

// For integration tests
public partial class Program { }
