using MediBot.API.Enums;
using System.Text.Json.Serialization;

namespace MediBot.API.Models
{
    public class IntentResult
    {
        public string FulFillmentText { get; set; }
        public string IntentName { get; set; }
        public bool IsIntentResponse { get; set; }
        public APITypeEnum APIType { get; set; }
    }
}
