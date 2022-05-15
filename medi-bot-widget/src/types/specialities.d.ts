type SpecialitiesRequest = {
  apiType: number;
  intentName: string;
}

type Doctor = {
  id: number;
  name: string;
  specialityId: number;
  timeSlotIds: string;
}

type Speciality = {
  id: number;
  specialityName: string;
  doctors: Array<Doctor>;
}

type Specialities = {
  apiType: number;
  needAction: boolean;
  data: Array<Speciality>;
}

type SpecialitiesResponse = Specialities;