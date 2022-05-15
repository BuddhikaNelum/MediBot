import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ChatResponse } from "../types/chat.type";

export const apiSlice = createApi({
  reducerPath: "chat",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7132/api/" }),
  endpoints: (build) => ({
    chat: build.query<ChatResponse, string>({
      query: (message) => `DialogFlow/DetectIntent/${message}`
    }),
    doctors: build.query<any, DoctorsRequest>({
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
    booking: build.query<any, BookingRequest>({
      query: (body) => ({
        url: `DialogFlow/Booking`,
        method: 'POST',
        body
      })
    }),
  })
})

export const { useLazyChatQuery, useLazyDoctorsQuery, useLazySpecialitiesQuery, useLazyBookingQuery } = apiSlice;