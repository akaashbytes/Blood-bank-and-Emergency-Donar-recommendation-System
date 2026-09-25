using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Application.Mappings;
using LifeLink.Blood.Application.Services;
using LifeLink.Blood.Application.Validators;
using LifeLink.Blood.Api.Middleware;
using LifeLink.Blood.Infrastructure.Data;
using LifeLink.Blood.Infrastructure.Identity;
using LifeLink.Blood.Infrastructure.Repositories;
using LifeLink.Blood.Infrastructure.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// === 1. Database Configuration (PostgreSQL 18 + PostGIS) ===
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql => npgsql.UseNetTopologySuite())
);

// === 2. Identity & JWT Settings ===
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() 
    ?? new JwtSettings { SecretKey = "lifelink-super-secret-jwt-signing-key-for-blood-bank-emergency-platform-2026", Issuer = "lifelink-blood-api", Audience = "lifelink-blood-frontend" };

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// === 3. Role-Based Access Control (RBAC) Policies ===
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("DonorOnly", policy =>
        policy.RequireRole("DONOR"));
    options.AddPolicy("DonorAccess", policy =>
        policy.RequireRole("DONOR"));
    options.AddPolicy("CoordinatorOrAdmin", policy =>
        policy.RequireRole("COORDINATOR", "ADMIN"));
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("ADMIN"));
});

// === 4. Application Services & Repositories ===
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IDonorRepository, DonorRepository>();
builder.Services.AddScoped<IBloodStockRepository, BloodStockRepository>();
builder.Services.AddScoped<IExpiryAlertRepository, ExpiryAlertRepository>();
builder.Services.AddScoped<IEmergencyRequestRepository, EmergencyRequestRepository>();
builder.Services.AddScoped<IDonorPledgeRepository, DonorPledgeRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDonorService, DonorService>();
builder.Services.AddScoped<IBloodStockService, BloodStockService>();
builder.Services.AddScoped<IExpiryAlertService, ExpiryAlertService>();
builder.Services.AddScoped<IEmergencyRequestService, EmergencyRequestService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();

builder.Services.AddScoped<DatabaseSeeder>();

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapperProfile>());
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();

// === 5. CORS Policy ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// === 6. Controllers & Swagger/OpenAPI ===
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// === 7. Middleware Pipeline ===
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LifeLink Blood API v1");
    });
}

app.UseCors("FrontendCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// === 8. Database Migration & Development Seeding ===
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.MigrateAsync();

        var seeder = services.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration or seeding.");
    }
}

app.Run();
