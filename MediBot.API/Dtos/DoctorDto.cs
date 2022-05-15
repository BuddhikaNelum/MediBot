using MediBot.API.Enums;

namespace MediBot.API.Dtos
{
    public class DoctorDto
    {
        public APITypeEnum APIType { get; set; }
        public string? IntentName { get; set; }
    }
}
