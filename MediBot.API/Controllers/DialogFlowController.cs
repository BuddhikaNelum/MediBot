using MediBot.API.Dtos;
using MediBot.API.Enums;
using MediBot.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MediBot.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DialogFlowController : ControllerBase
    {
        private readonly IDialogFlowWebService dialogFlowWebService;
        private readonly IIntentDataService intentDataService;

        public DialogFlowController(IDialogFlowWebService dialogFlowWebService, IIntentDataService intentDataService)
        {
            this.dialogFlowWebService = dialogFlowWebService;
            this.intentDataService = intentDataService;
        }

        [HttpGet("DetectIntent/{text}")]
        public async Task<IActionResult> DetectIntentAsync([FromRoute]string text)
        {
            var response = await dialogFlowWebService.DetectIntentAsync(text);
            return Ok(response);
        }

        [HttpPost("Doctors")]
        public async Task<IActionResult> GetDoctors([FromBody]DoctorDto doctorDto)
        {
            var response = await intentDataService.GetDoctors(doctorDto.APIType, doctorDto.IntentName);
            var result = new { data = response, apiType = APITypeEnum.Bookings, NeedAction = true };
            return Ok(result);
        }

        [HttpPost("Specialities")]
        public async Task<IActionResult> Specialities([FromBody] SpecialityDto specialityDto)
        {
            var response = await intentDataService.GetSpecialities(specialityDto.APIType, specialityDto.IntentName);
            var result = new { data = response, apiType = APITypeEnum.Bookings, NeedAction = true };
            return Ok(result);
        }

        [HttpPost("Booking")]
        public async Task<IActionResult> Booking([FromBody] BookingDto bookingDto)
        {
            var response = await intentDataService.PlaceBooking(bookingDto);
            return Ok(response);
        }
    }
}
