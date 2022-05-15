﻿namespace MediBot.API.Data
{
    public class Speciality
    {
        public int Id { get; set; }
        public string SpecialityName { get; set; }
        public ICollection<Doctor> Doctors { get; set; }
    }
}
