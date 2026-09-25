using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace LifeLink.Blood.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred during request execution.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var (statusCode, title, typeSuffix) = exception switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Authentication failed", "invalid-credentials"),
            KeyNotFoundException => (HttpStatusCode.NotFound, "Resource not found", "resource-not-found"),
            InvalidOperationException => (HttpStatusCode.Conflict, "Business rule violation", "conflict"),
            ArgumentException => (HttpStatusCode.BadRequest, "Validation failure", "validation-error"),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred", "internal-error")
        };

        context.Response.StatusCode = (int)statusCode;

        var problemDetails = new ProblemDetails
        {
            Type = $"https://lifelink.blood/errors/{typeSuffix}",
            Title = title,
            Status = (int)statusCode,
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        return context.Response.WriteAsync(json);
    }
}
