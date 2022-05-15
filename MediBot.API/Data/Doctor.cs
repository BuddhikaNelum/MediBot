namespace MediBot.API.Data
{
    public class Doctor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TimeSlotIds { get; set; }
        public int SpecialityId { get; set; }
        public Speciality Speciality { get; set; }
    }
}
