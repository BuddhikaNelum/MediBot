using MediBot.API.Interfaces;
using MediBot.API.Services;
using MediBot.API.Settings;

namespace MediBot.API
{
    public static class DependencyContainer
    {
        public static IServiceCollection InjectServices(this IServiceCollection services, IConfiguration configuration)
        {
            //AppSettings
            services.Configure<DialogFlowSettings>(configuration.GetSection("DialogFlow"));

            //Services
            services.AddScoped<IDialogFlowWebService, DialogFlowWebService>();

            return services;
        }
    }
}
