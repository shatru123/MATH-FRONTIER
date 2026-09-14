# Multi-stage Dockerfile for MathFrontier.Api (.NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY MathFrontier.slnx ./
COPY MathFrontier.Core/MathFrontier.Core.csproj MathFrontier.Core/
COPY MathFrontier.Infrastructure/MathFrontier.Infrastructure.csproj MathFrontier.Infrastructure/
COPY MathFrontier.Api/MathFrontier.Api.csproj MathFrontier.Api/
COPY MathFrontier.Tests/MathFrontier.Tests.csproj MathFrontier.Tests/

RUN dotnet restore MathFrontier.slnx

# Copy entire source and build
COPY . .
WORKDIR /src/MathFrontier.Api
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
