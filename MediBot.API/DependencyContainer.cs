using MediBot.API.Data;
using MediBot.API.Interfaces;
using MediBot.API.Services;
using MediBot.API.Settings;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace MediBot.API
{
    public static class DependencyContainer
    {
        public static IServiceCollection InjectServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient();

            services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            services.AddDbContext<AppDBContext>(o => o.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            //AppSettings
            services.Configure<DialogFlowSettings>(configuration.GetSection("DialogFlow"));
            services.Configure<EmailSettings>(configuration.GetSection("Email"));

            //Services
            services.AddScoped<IDialogFlowWebService, DialogFlowWebService>();
            services.AddScoped<IIntentDataService, IntentDataService>();

            return services;
        }
    }
}
