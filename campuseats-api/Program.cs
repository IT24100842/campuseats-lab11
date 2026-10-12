using System.Diagnostics;
using System.Text;
using CampusEats.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── Port ────────────────────────────────────────────────────────────
// Cloud hosts (Render, Railway) tell the app which port to use through
// the PORT environment variable. Listen on 0.0.0.0 so traffic from the
// platform's router reaches the container. Locally ASPNETCORE_URLS /
// launchSettings.json are used instead.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── Configuration that must come from environment variables ─────────
// ConnectionStrings__Default -> ConnectionStrings:Default
// Jwt__Key                   -> Jwt:Key
// Cors__AllowedOrigins       -> Cors:AllowedOrigins (comma separated)
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("ConnectionStrings__Default is not set.");

var jwt = builder.Configuration.GetSection("Jwt");
var jwtKey = jwt["Key"];
if (string.IsNullOrEmpty(jwtKey) || jwtKey.Length < 32)
    throw new InvalidOperationException("Jwt__Key must be set and at least 32 characters long.");

var allowedOrigins = (builder.Configuration["Cors:AllowedOrigins"] ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Select(o => o.TrimEnd('/'))
    .ToArray();

builder.Services.AddDbContext<CampusEatsDbContext>(o => o.UseNpgsql(connectionString));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwt["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwt["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
    });
builder.Services.AddAuthorization();

// ── CORS: allow only the deployed frontend origin(s) ────────────────
builder.Services.AddCors(o => o.AddPolicy("Frontend", p => p
    .WithOrigins(allowedOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()
    // The menu page reads the total count from this header for paging;
    // cross-origin JS can only see it if the server exposes it.
    .WithExposedHeaders("X-Total-Count")));

builder.Services.AddHealthChecks().AddDbContextCheck<CampusEatsDbContext>("database");
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Render/Railway terminate HTTPS at their proxy and forward plain HTTP.
builder.Services.Configure<ForwardedHeadersOptions>(o =>
{
    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    o.KnownNetworks.Clear();
    o.KnownProxies.Clear();
});

var app = builder.Build();

// Optional: apply EF Core migrations when the container starts. The lab's
// main path is `dotnet ef database update` from a laptop; this switch is a
// fallback for hosts where you cannot run that command.
if (app.Configuration.GetValue<bool>("Database:MigrateOnStartup"))
{
    using var scope = app.Services.CreateScope();
    scope.ServiceProvider.GetRequiredService<CampusEatsDbContext>().Database.Migrate();
    app.Logger.LogInformation("Database migrations applied on startup");
}

app.UseForwardedHeaders();

// One structured log line per request: this is what you read in the
// Render/Railway "Logs" tab during Task 05.
app.Use(async (ctx, next) =>
{
    var sw = Stopwatch.StartNew();
    await next();
    app.Logger.LogInformation("HTTP {Method} {Path} responded {Status} in {Elapsed} ms",
        ctx.Request.Method, ctx.Request.Path, ctx.Response.StatusCode, sw.ElapsedMilliseconds);
});

// Swagger stays on in production for this lab so the API can be tested in the browser.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("Frontend");   // before MapControllers()
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new { service = "CampusEats API", status = "running", docs = "/swagger" }));
app.MapHealthChecks("/health");
app.MapControllers();

app.Logger.LogInformation("CampusEats API starting in {Env}; CORS origins: {Origins}",
    app.Environment.EnvironmentName, string.Join(", ", allowedOrigins));

app.Run();
