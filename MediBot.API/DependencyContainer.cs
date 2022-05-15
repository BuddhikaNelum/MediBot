using MediBot.API.Data;
using MediBot.API.Interfaces;
using MediBot.API.Services;
using MediBot.API.Settings;
using Microsoft.EntityFrameworkCore;

namespace MediBot.API
{
    public static class DependencyContainer
    {
        public static IServiceCollection InjectServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDBContext>(o => o.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            //AppSettings
            services.Configure<DialogFlowSettings>(configuration.GetSection("DialogFlow"));

            //Services
            services.AddScoped<IDialogFlowWebService, DialogFlowWebService>();

            return services;
        }
    }
}
