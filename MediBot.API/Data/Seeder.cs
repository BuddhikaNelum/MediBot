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
                    SpecialityId = 1
                },
                new Doctor
                {
                    Name = "Dr.Shashika Janith",
                    SpecialityId = 2
                },
                new Doctor
                {
                    Name = "Dr.Ashala Senanayake",
                    SpecialityId = 3
                },
                new Doctor
                {
                    Name = "Dr.Stephen Strange",
                    SpecialityId = 4
                },
                new Doctor
                {
                    Name = "Dr.Otto Octavius",
                    SpecialityId = 5
                }
            };

            var doctors = await context.Doctors.ToListAsync();

            if (!doctors.Any())
            {
                await context.Doctors.AddRangeAsync(doctorsList);
                await context.SaveChangesAsync();
            }
        }
    }
}
