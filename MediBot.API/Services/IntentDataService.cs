using MediBot.API.Constants;
using MediBot.API.Data;
using MediBot.API.Dtos;
using MediBot.API.Enums;
using MediBot.API.Interfaces;
using MediBot.API.Models;
using MediBot.API.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace MediBot.API.Services
{
    public class IntentDataService : IIntentDataService
    {
        private readonly AppDBContext context;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IOptions<EmailSettings> emailSettings;

        public IntentDataService(AppDBContext context, IHttpClientFactory httpClientFactory, IOptions<EmailSettings> emailSettings)
        {
            this.context = context;
            this.httpClientFactory = httpClientFactory;
            this.emailSettings = emailSettings;
        }

        public async Task<List<Doctor>> GetDoctors(APITypeEnum apiType, string intentName)
        {
            var doctors = new List<Doctor>();

            if(apiType == APITypeEnum.Doctors)
            {

                if(intentName == null || intentName == IntentTypes.Booking)
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
                        case IntentTypes.Cardiologists:
                            doctors = await context.Doctors.Include(x => x.Speciality).Where(x => x.SpecialityId == 2).ToListAsync();
                            return doctors;
                        case IntentTypes.Dermatologists:
                            doctors = await context.Doctors.Include(x => x.Speciality).Where(x => x.SpecialityId == 3).ToListAsync();
                            return doctors;
                        case IntentTypes.Psychiatrists:
                            doctors = await context.Doctors.Include(x => x.Speciality).Where(x => x.SpecialityId == 4).ToListAsync();
                            return doctors;
                        case IntentTypes.Ophthalmologists:
                            doctors = await context.Doctors.Include(x => x.Speciality).Where(x => x.SpecialityId == 5).ToListAsync();
                            return doctors;
                        default:
                            return doctors;
                    }   
                }
            }
            return doctors;
        }

        public async Task<List<Speciality>> GetSpecialities(APITypeEnum apiType, string intentName)
        {
            var specialities = new List<Speciality>();

            if(apiType == APITypeEnum.Specialities && intentName == IntentTypes.Booking || intentName == null)
            {
                specialities = await context.Specialities.Include(x => x.Doctors).ToListAsync();
            }
            return specialities;
        }

        public async Task<BookingResponseDto> PlaceBooking(BookingDto bookingDto)
        {
            var patient = context.Patients.Where(x => x.Email == bookingDto.Email).FirstOrDefault();

            if(patient == null)
            {
                patient = new Patient
                {
                    Email  = bookingDto.Email,
                    Name = bookingDto.Name,
                    Age = bookingDto.Age,
                    Gender = bookingDto.Gender,
                };

                await context.Patients.AddAsync(patient);
                await context.SaveChangesAsync();
            }

            var isTimeSlotAvailable = await context.Bookings.Where
                (
                x => x.TimeSlotId == bookingDto.TimeSlotId && 
                x.DoctorId == bookingDto.DoctorId &&
                x.DateTime.Date == bookingDto.DateTime.Date)
                .FirstOrDefaultAsync();

            if(isTimeSlotAvailable != null)
            {
                return new BookingResponseDto
                {
                    Status = false,
                    Message = "This time slot is already taken, please try a different Date or Time Slot"
                };
            }

            var booking = new Booking
            {
                PatientId = patient.Id,
                DoctorId = bookingDto.DoctorId,
                TimeSlotId = bookingDto.TimeSlotId,
                DateTime = bookingDto.DateTime
            };

            await context.Bookings.AddAsync(booking);
            await context.SaveChangesAsync();

            var doctor = await context.Doctors.Where(x => x.Id == booking.DoctorId).Include(x => x.Speciality).FirstOrDefaultAsync();
            var timeSlot = await context.TimeSlots.Where(x => x.Id == booking.TimeSlotId).FirstOrDefaultAsync();

            var emailDto = new EmailDto
            {
                Name = bookingDto.Name,
                ToEmail = patient.Email,
                DoctorName = doctor.Name,
                Speciality = doctor.Speciality.SpecialityName,
                Date = booking.DateTime.ToString("yyyy/MM/dd"),
                Time = timeSlot.Time.ToString(),
                RoomId = timeSlot.RoomId.ToString()
            };

            await SendBookingEmail(emailDto);

            return new BookingResponseDto
            {
                Status = true,
                Message = "Your channeling is completed. You will receive a confirmation email shortly."
            };
        }

        private async Task SendBookingEmail(EmailDto emailDto)
        {
            var httpClient = httpClientFactory.CreateClient();

            var url = "https://api.sendinblue.com/v3/smtp/email";
            var key = emailSettings.Value.Key;

            httpClient.DefaultRequestHeaders.Add("api-key", key);

            Random generator = new Random();

            var body = new EmailBody
            {
                Sender = new Sender
                {
                    Name = "MediBot Booking Agent",
                    Email = "dlbnprabath@gmail.com"
                },
                To = new List<To>
                {
                    new To { Email = emailDto.ToEmail, Name =  emailDto.Name}
                },
                Subject = "MediBot Booking",
                HtmlContent = "<html><head></head><body><p>Hi " + emailDto.Name + "</p>Booking has been confirmed. Please make your payment using the Reference Number.</br> </br>" +
                "Reference Number - " + generator.Next(0, 1000000).ToString("D6") + " </br> " +
                "Doctor Name - " + emailDto.DoctorName + " ("+ emailDto.Speciality + ")" + " </br> " +
                "Customer Name - " + emailDto.Name + " </br>" +
                "Customer Email - " + emailDto.ToEmail + " </br>" +
                "Appoinment Date - " + emailDto.Date + " " + emailDto.Time + " </br>" +
                "Room No - " + emailDto.RoomId + " </br>" +
                "Total Fee - 3250 LKR </br>" +
                "</p></body></html></p>"
            };

            var content = JsonSerializer.Serialize(body);
            var response = await httpClient.PostAsync(url, new StringContent(content, Encoding.UTF8, "application/json"));
            var stringContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<EmailResponse>(stringContent);
            var Id = result.MessageId;
        }
    }
}
