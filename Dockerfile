# Multi-stage Dockerfile for Math Frontier (Unified Full-Stack: React Frontend + .NET 10 API)

# Stage 1: Build React Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/math-frontier-web/package*.json ./
RUN npm ci
COPY frontend/math-frontier-web/ ./
RUN npm run build

# Stage 2: Build .NET 10 API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
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

# Stage 3: Unified ASP.NET Core Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Environment configuration
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DATABASE_PROVIDER=sqlite
ENV PORT=5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "MathFrontier.Api.dll"]
