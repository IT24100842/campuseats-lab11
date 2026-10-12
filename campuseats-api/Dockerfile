# ── Stage 1: build ───────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Restore first so the NuGet layer is cached between builds
COPY CampusEats.Api.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish CampusEats.Api.csproj -c Release -o /app --no-restore

# ── Stage 2: runtime (smaller image, no SDK) ────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
# Listen on all interfaces on port 8080. If the platform sets PORT
# (Render/Railway do), Program.cs listens on that port instead.
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
# Run as the non-root user that ships with the .NET 8 images
USER $APP_UID
ENTRYPOINT ["dotnet", "CampusEats.Api.dll"]
