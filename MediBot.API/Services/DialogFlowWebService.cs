using Google.Cloud.Dialogflow.V2;
using MediBot.API.Interfaces;
using MediBot.API.Settings;
using Microsoft.Extensions.Options;

namespace MediBot.API.Services
{
    public class DialogFlowWebService : IDialogFlowWebService
    {
        private readonly IOptions<DialogFlowSettings> dialogFlowSettings;
        private SessionsClient sessionsClient;
        private SessionName sessionName;

        public DialogFlowWebService(IOptions<DialogFlowSettings> dialogFlowSettings)
        {
            this.dialogFlowSettings = dialogFlowSettings;
            SetEnvironmentVariable();
        }

        public async Task<QueryResult> DetectIntentAsync(string text)
        {
            try
            {
                await CreateSession();

                var query = new QueryInput
                {
                    Text = new TextInput
                    {
                        Text = text,
                        LanguageCode = "en"
                    }
                };

                DetectIntentResponse response = await sessionsClient.DetectIntentAsync(sessionName, query);
                return response.QueryResult;

            }
            catch (Exception)
            {

                throw;
            }
        }

        private async Task CreateSession()
        {
            try
            {
                var projectId = "medibot-hdwg";
                sessionsClient = await SessionsClient.CreateAsync();
                sessionName = new SessionName(projectId, Guid.NewGuid().ToString());
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void SetEnvironmentVariable()
        {
            try
            {
                var json = "medibot-hdwg-75e4f896439a.json";
                System.Environment.SetEnvironmentVariable(dialogFlowSettings.Value.Key, dialogFlowSettings.Value.KeyPath + json);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
