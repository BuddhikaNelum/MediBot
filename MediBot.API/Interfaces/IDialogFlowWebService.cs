using Google.Cloud.Dialogflow.V2;

namespace MediBot.API.Interfaces
{
    public interface IDialogFlowWebService
    {
        Task<QueryResult> DetectIntentAsync(string text);
    }
}
