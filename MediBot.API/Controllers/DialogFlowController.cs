using MediBot.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MediBot.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DialogFlowController : ControllerBase
    {
        private readonly IDialogFlowWebService dialogFlowWebService;

        public DialogFlowController(IDialogFlowWebService dialogFlowWebService)
        {
            this.dialogFlowWebService = dialogFlowWebService;
        }

        [HttpGet("DetectIntent/{text}")]
        public async Task<IActionResult> DetectIntentAsync([FromRoute]string text)
        {
            var response = await dialogFlowWebService.DetectIntentAsync(text);
            return Ok(response);
        }
    }
}
