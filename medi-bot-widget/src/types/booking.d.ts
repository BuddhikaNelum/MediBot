type Booking = {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: number;
  doctorId: number;
  timeSlotId: number;
  dateTime: string;
}

type BookingRequest = Booking

type BookingResponse = {
  message: string;
  status: boolean
}