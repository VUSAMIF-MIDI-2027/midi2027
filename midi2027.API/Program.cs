using midi2027.API.Common.Extensions;
using midi2027.API.Middleware;
using Serilog;
using System.Threading.RateLimiting;

namespace midi2027.API
{
    public class Program
    { 
        public static void Main(string[] args)
        {
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                builder.Host.UseSerilog((context, configuration) =>
                {
                    configuration.ReadFrom.Configuration(context.Configuration);
                });

                builder.WebHost.UseUrls("http://localhost:5000");
                // Add services to the container.

                builder.Services.AddControllers();
                builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
                    policy.WithOrigins(
                            "http://localhost:3000",
                            "http://127.0.0.1:3000",
                            "https://midi.lt",
                            "https://www.midi.lt")
                        .AllowAnyHeader()
                        .AllowAnyMethod()));
                // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();
                builder.Services.AddAppSettings(builder.Configuration);

                builder.Services.AddRateLimiter(options =>
                {
                    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                    options.AddPolicy("LatestFeedPolicy", httpContext =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                            factory: _ => new FixedWindowRateLimiterOptions
                            {
                                PermitLimit = 20,
                                Window = TimeSpan.FromMinutes(1),
                                QueueLimit = 0,
                                AutoReplenishment = true
                            }));
                });
                
                builder.Services.AddSingleton<midi2027.API.Services.MapLocationService>();
                var app = builder.Build();

                // Configure the HTTP request pipeline.
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }
                app.UseMiddleware<TraceLoggingMiddleware>();

                app.UseCors("Frontend");
                app.UseAuthorization();

                app.UseRateLimiter();

                app.MapControllers();

                app.Run();
            }
            catch(Exception ex)
            {
                using var startupLogger = new StreamWriter("failed-startup.log");
                startupLogger.WriteLine("Application failed to start");
                startupLogger.WriteLine("Exception message: " + ex.Message);
                startupLogger.WriteLine("Inner exception message:" + ex.InnerException?.Message);
            }
        }
    }
}

