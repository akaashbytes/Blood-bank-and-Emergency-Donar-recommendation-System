# LifeLink Blood Platform — Backend Web API

ASP.NET Core 10 Web API backend built with Entity Framework Core 10, PostgreSQL 18, and PostGIS 3.5 spatial capabilities.

---

## 🛠 Prerequisites & Environment Setup

Before running the backend, ensure your development machine has:

1. **.NET SDK 10.0** (or higher)
   - Verify installation: `dotnet --version`
2. **PostgreSQL 18** with **PostGIS 3.5** extension installed
   - Verify PostgreSQL service is running on `localhost:5432`.
   - Ensure the PostGIS extension can be enabled (`CREATE EXTENSION IF NOT EXISTS postgis;`).

---

## 🗄 Database Configuration

1. Default Database Name: `lifelink_blood`
2. Configure your local database connection string in `src/LifeLink.Blood.Api/appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=lifelink_blood;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
  }
}
```

> 💡 **Tip:** A template configuration is provided in [`appsettings.Development.example.json`](file:///r:/final%20year%20rpoject/blood%20bank/backend/src/LifeLink.Blood.Api/appsettings.Development.example.json).

---

## 🚀 EF Core Database Migration & Startup

### 1. Apply Migrations

Run EF Core migrations from the `backend` directory to initialize the database schema and PostGIS tables:

```bash
dotnet ef database update --project src/LifeLink.Blood.Infrastructure --startup-project src/LifeLink.Blood.Api
```

*(Alternatively, the application automatically applies pending migrations and seeds development data on startup when running in Development environment.)*

### 2. Run the Backend API

```bash
dotnet run --project src/LifeLink.Blood.Api/LifeLink.Blood.Api.csproj
```

The API will start listening at:
- **HTTP:** `http://localhost:5236`
- **Swagger / OpenAPI Documentation:** `http://localhost:5236/swagger`

---

## 🔑 Seeded Mock Development Accounts

The system automatically seeds demo user credentials for testing:

| Role | Email | Password | Access / Capabilities |
|---|---|---|---|
| **DONOR** | `ananya.donor@lifelink.org` | `Password123!` | Private profile, self health metrics, request pledges |
| **REQUESTER** | `dr.rajesh@aiims.edu` | `Password123!` | Create & track emergency requisitions |
| **COORDINATOR** | `sunita.v@bloodbank.gov.in` | `Password123!` | Inventory management, candidate donor matching, stock allocation |
| **ADMIN** | `admin@lifelink.gov.in` | `Password123!` | Full system administration, audit logs history |

---

## 🧪 Running Unit & Integration Tests

Execute the xUnit test suite from the `backend` directory:

```bash
dotnet test
```

---

## 🏗 Solution Structure (Clean Architecture)

- **`src/LifeLink.Blood.Domain`**: Core entities (`User`, `DonorRecord`, `BloodStockItem`, `EmergencyRequest`, `AuditLog`), enums, and compatibility domain logic.
- **`src/LifeLink.Blood.Application`**: Business logic, DTOs, service implementations, mappings, and repository interfaces.
- **`src/LifeLink.Blood.Infrastructure`**: EF Core 10 `ApplicationDbContext`, entity Fluent API configurations, repositories, and seeders.
- **`src/LifeLink.Blood.Api`**: Controllers, JWT Bearer authentication, policy RBAC, and middleware.
- **`tests/LifeLink.Blood.Application.Tests`**: xUnit test project.
