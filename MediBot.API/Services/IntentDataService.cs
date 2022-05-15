using MediBot.API.Constants;
using MediBot.API.Data;
using MediBot.API.Enums;
using MediBot.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediBot.API.Services
{
    public class IntentDataService : IIntentDataService
    {
        private readonly AppDBContext context;

        public IntentDataService(AppDBContext context)
        {
            this.context = context;
        }

        public async Task<List<Doctor>> GetDoctors(APITypeEnum apiType, string intentName)
        {
            var doctors = new List<Doctor>();

            if(apiType == APITypeEnum.Doctors)
            {

                if(intentName == null)
                {
                    doctors = await context.Doctors.Include(x => x.Speciality).ToListAsync();
                }
                else
                {
                    switch (intentName)
                    {
                        case IntentTypes.Allergists:
                            doctors = await context.Doctors.Include(x => x.Speciality).Where(x => x.SpecialityId == 1).ToListAsync();
                            return doctors;
                        default:
                            throw new Exception();
                    }   
                }
            }
            return doctors;
        }
    }
}
