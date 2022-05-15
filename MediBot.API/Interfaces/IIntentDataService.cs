using MediBot.API.Data;
using MediBot.API.Enums;

namespace MediBot.API.Interfaces
{
    public interface IIntentDataService
    {
        Task<List<Doctor>> GetDoctors(APITypeEnum apiType, string intentName);
        Task<List<Speciality>> GetSpecialities(APITypeEnum apiType, string intentName);
    }
}
