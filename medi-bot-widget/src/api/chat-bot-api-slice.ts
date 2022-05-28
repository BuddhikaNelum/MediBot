import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import { ChatResponse } from "../types/chat.type";

export const apiSlice = createApi({
  reducerPath: "chat",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7132/api/" }),
  endpoints: (build) => ({
    chat: build.query<ChatResponse, string>({
      query: (message) => `DialogFlow/DetectIntent/${message}`
    }),
    doctors: build.query<DoctorsResponse, DoctorsRequest>({
      query: (body) => ({
        url: `DialogFlow/Doctors`,
        method: 'POST',
        body
      })
    }),
    specialities: build.query<SpecialitiesResponse, SpecialitiesRequest>({
      query: (body) => ({
        url: `DialogFlow/Specialities`,
        method: 'POST',
        body
      })
    }),
    booking: build.query<BookingResponse, BookingRequest>({
      query: (body) => ({
        url: `DialogFlow/Booking`,
        method: 'POST',
        body
      })
    }),
  })
})

export const { useLazyChatQuery, useLazyDoctorsQuery, useLazySpecialitiesQuery, useLazyBookingQuery } = apiSlice;