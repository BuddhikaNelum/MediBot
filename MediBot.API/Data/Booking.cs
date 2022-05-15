namespace MediBot.API.Data
{
    public class Booking
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int RoomId { get; set; }
        public int TimeSlotId { get; set; }
        public DateTime DateTime { get; set; }
    }
}
