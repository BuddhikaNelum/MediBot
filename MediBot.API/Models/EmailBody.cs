using System.Text.Json.Serialization;

namespace MediBot.API.Models
{
    public class EmailBody
    {
        [JsonPropertyName("sender")]
        public Sender Sender { get; set; }
        [JsonPropertyName("to")]
        public List<To> To { get; set; }
        [JsonPropertyName("subject")]
        public string Subject { get; set; }
        [JsonPropertyName("htmlContent")]
        public string HtmlContent { get; set; }
    }

    public class Sender
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
    }

    public class To
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }

    public class EmailResponse
    {
        [JsonPropertyName("messageId")]
        public string MessageId { get; set; }
    }
}
