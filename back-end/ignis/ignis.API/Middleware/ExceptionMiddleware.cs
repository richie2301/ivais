using Newtonsoft.Json;
using System.Net;

namespace lunar.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (IOException ex)
            {
                _logger.LogError($"Something went wrong: {ex}");

                if (ex.Message.Contains("There is not enough space on the disk."))
                {
                    httpContext.Response.ContentType = "application/json";
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        StatusCode = httpContext.Response.StatusCode,
                        Message = ex.Message
                    }));
                }
                else
                {
                    await HandleExceptionAsync(httpContext, ex);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong: {ex}");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(new
            {
                StatusCode = context.Response.StatusCode,
                Message = $"Uncaught Exception. {exception.Message}"
            }));
        }
    }
}