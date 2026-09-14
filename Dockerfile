# Multi-stage Dockerfile for Math Frontier API (.NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files for caching dependency restore
COPY backend/MathFrontier.slnx ./backend/
COPY backend/MathFrontier.Core/MathFrontier.Core.csproj ./backend/MathFrontier.Core/
COPY backend/MathFrontier.Infrastructure/MathFrontier.Infrastructure.csproj ./backend/MathFrontier.Infrastructure/
COPY backend/MathFrontier.Api/MathFrontier.Api.csproj ./backend/MathFrontier.Api/
COPY backend/MathFrontier.Tests/MathFrontier.Tests.csproj ./backend/MathFrontier.Tests/

RUN dotnet restore ./backend/MathFrontier.slnx

# Copy backend source and compile
COPY backend/ ./backend/
WORKDIR /src/backend/MathFrontier.Api
RUN dotnet publish MathFrontier.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Environment configuration
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DATABASE_PROVIDER=sqlite
ENV PORT=5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "MathFrontier.Api.dll"]
