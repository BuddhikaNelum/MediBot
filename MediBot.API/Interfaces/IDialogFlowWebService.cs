using MediBot.API.Models;

namespace MediBot.API.Interfaces
{
    public interface IDialogFlowWebService
    {
        Task<IntentResult> DetectIntentAsync(string text);
    }
}
