global using ignis.Domain.Data;
global using Microsoft.EntityFrameworkCore;
using ignis.API.Controllers;
using lunar.API.Middleware;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using System.Reflection;

#if DEBUG
string Logs_Root_Folder = "../../logs";
#elif RELEASE
string Logs_Root_Folder = "logs";
#endif

var builder = WebApplication.CreateBuilder(args);
var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? Environments.Development;

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddJsonFile($"appsettings.{environmentName}.json", optional: true);
builder.Configuration.AddEnvironmentVariables();

// Configure logger
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    //    .Enrich.WithProperty("Version", version)
    .Enrich.WithProperty("Environment", environmentName)
    .Enrich.WithThreadId()
    .Enrich.WithMachineName()
    .WriteTo.Console()
    .WriteTo.File($"{Logs_Root_Folder}/xit_appliance_api.log")
    .WriteTo.NewRelicLogs(applicationName: Assembly.GetExecutingAssembly().GetName().Name, licenseKey: "467a67637def208f2067bb4aea61c8933212NRAL")
    .CreateLogger();

Log.Information($"Logging at xit_appliance_api.log");
Log.Information($"Starting {Assembly.GetExecutingAssembly().GetName().Name}...");

// Add services to the container.
builder.Services.Configure<FormOptions>(options => {
        options.MultipartBodyLengthLimit = 10000000000; // 10 GB in bytes
    });
builder.Services
    .AddMvc()
    .AddNewtonsoftJson(options => {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    });
builder.Services
    .AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    });
builder.Services.AddDbContext<DataContext>(options => 
        options.UseNpgsql("Server=localhost;Database=ignis;Port=5432;User Id=postgres;Password=Admin123",
        b => b.MigrationsAssembly(Assembly.GetExecutingAssembly().GetName().Name))
    );
builder.Services.AddDbContext<FaceMeSecurityContext>(options =>
        options.UseSqlServer("Server=localhost,1433;Database=faceme_security;User Id=faceme_dba;Password=Admin123;TrustServerCertificate=true")
    );
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGenNewtonsoftSupport();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddResponseCaching();
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = HttpLoggingFields.All;
    logging.RequestHeaders.Add(HeaderNames.Accept);
    logging.RequestHeaders.Add(HeaderNames.ContentType);
    logging.RequestHeaders.Add(HeaderNames.ContentDisposition);
    logging.RequestHeaders.Add(HeaderNames.ContentEncoding);
    logging.RequestHeaders.Add(HeaderNames.ContentLength);

    logging.MediaTypeOptions.AddText("application/json");
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;
});
builder.Services.AddSignalR();
builder.Services.AddTransient<TagController>();

builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());
app.UseResponseCompression();
app.UseMiddleware<ExceptionMiddleware>();
//app.UseHttpsRedirection();
app.UseResponseCaching();
app.UseAuthorization();
app.MapControllers();
app.MapHub<IgnisHub>("/ignisHub");
app.Run();