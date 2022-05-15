using MediBot.API.Constants;
using MediBot.API.Data;
using MediBot.API.Dtos;
using MediBot.API.Enums;
using MediBot.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediBot.API.Services
{
    public class IntentDataService : IIntentDataService
    {
        private readonly AppDBContext context;

        public IntentDataService(AppDBContext context)
        {
            this.context = context;
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
                        default:
                            throw new Exception();
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
                x.DateTime.Date == DateTime.Today.Date)
                .FirstOrDefaultAsync();

            if(isTimeSlotAvailable != null)
            {
                return new BookingResponseDto
                {
                    Status = false,
                    Message = "This time slot already taken"
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

            return new BookingResponseDto
            {
                Status = true,
                Message =  "Booking Confirmed"
            };
        }
    }
}
