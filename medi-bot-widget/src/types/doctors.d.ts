type Doctor = {
  id: number;
  name: string;
  specialityId: number;
  timeSlotIds: string;
}

type DoctorsRequest = {
  apiType: number,
  intentName: string
}

type Doctors = {
  apiType: number;
  needAction: boolean;
  data: Array<Doctor>;
}

type DoctorsResponse = Doctors;