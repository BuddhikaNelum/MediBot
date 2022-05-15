using Microsoft.EntityFrameworkCore;

namespace MediBot.API.Data
{
    public static class Seeder
    {
        public static async Task SeedData(AppDBContext context)
        {
            var specialityList = new List<Speciality>
            {
                new Speciality
                {
                    SpecialityName = "Allergists"
                },
                new Speciality
                {
                    SpecialityName = "Cardiologists"
                },
                new Speciality
                {
                    SpecialityName = "Dermatologists"
                },
                new Speciality
                {
                    SpecialityName = "Psychiatrists"
                },
                new Speciality
                {
                    SpecialityName = "Ophthalmologists"
                },
            };

            var specialities = await context.Specialities.ToListAsync();

            if (!specialities.Any())
            {
                await context.Specialities.AddRangeAsync(specialityList);
                await context.SaveChangesAsync();
            }


            var doctorsList = new List<Doctor>
            {
                new Doctor
                {
                    Name = "Dr.Buddhika Nelum",
                    SpecialityId = 1,
                    TimeSlotIds = "1,2",
                },
                new Doctor
                {
                    Name = "Dr.Shashika Janith",
                    SpecialityId = 2,
                    TimeSlotIds = "1,2,3",
                },
                new Doctor
                {
                    Name = "Dr.Ashala Senanayake",
                    SpecialityId = 3,
                    TimeSlotIds = "2,4",
                },
                new Doctor
                {
                    Name = "Dr.Stephen Strange",
                    SpecialityId = 4,
                    TimeSlotIds = "2,3,4",
                },
                new Doctor
                {
                    Name = "Dr.Otto Octavius",
                    SpecialityId = 5,
                    TimeSlotIds = "1,2,3,4",
                }
            };

            var doctors = await context.Doctors.ToListAsync();

            if (!doctors.Any())
            {
                await context.Doctors.AddRangeAsync(doctorsList);
                await context.SaveChangesAsync();
            }

            var timeSlotsList = new List<TimeSlot>
            {
                new TimeSlot
                {
                    RoomId = 10,
                    Time = "6PM - 7PM"
                },
                new TimeSlot
                {
                    RoomId = 11,
                    Time = "7PM - 8PM"
                },
                 new TimeSlot
                {
                    RoomId = 12,
                    Time = "8PM - 9PM"
                },
                 new TimeSlot
                {
                    RoomId = 13,
                    Time = "9PM - 10PM"
                }
            };

            var timeSlots = await context.TimeSlots.ToListAsync();

            if(!timeSlots.Any())
            {
                await context.TimeSlots.AddRangeAsync(timeSlotsList);
                await context.SaveChangesAsync();
            }
        }
    }
}
