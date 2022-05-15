namespace MediBot.API.Dtos
{
    public class BookingDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public int Gender { get; set; }
        public int DoctorId { get; set; }
        public int TimeSlotId { get; set; }
        public DateTime DateTime { get; set; }
    }
}
