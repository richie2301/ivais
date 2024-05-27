using ignis.NxService;
using Serilog;
using System.Reflection;

#if DEBUG
string Logs_Root_Folder = "../../logs";
#elif RELEASE
string Logs_Root_Folder = "logs";
#endif

var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? Environments.Development;

Log.Logger = new LoggerConfiguration()
    //.ReadFrom.Configuration(builder.Configuration)
    //.Enrich.WithProperty("Version", version)
    .Enrich.WithProperty("Environment", environmentName)
    .Enrich.WithThreadId()
    .Enrich.WithMachineName()
    .WriteTo.Console()
    .WriteTo.File($"{Logs_Root_Folder}/xit_appliance_nx_service.log")
    .WriteTo.NewRelicLogs(applicationName: Assembly.GetExecutingAssembly().GetName().Name, licenseKey: "467a67637def208f2067bb4aea61c8933212NRAL")
    .CreateLogger();

try
{
    Log.Information($"Logging at xit_appliance_nx_service.log");
    Log.Information($"Starting {Assembly.GetExecutingAssembly().GetName().Name}...");
    await CreateHostBuilder(args).Build().RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, $"{Assembly.GetExecutingAssembly().GetName().Name} start-up failed");
}
finally
{
    Log.CloseAndFlush();
}

IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .UseSerilog()
        .ConfigureServices(services =>
        {
            services.AddHostedService<Worker>();
        });