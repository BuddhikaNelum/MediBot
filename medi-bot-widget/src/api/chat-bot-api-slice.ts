import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ChatResponse } from "../types/chat.type";

export const apiSlice = createApi({
  reducerPath: "chat",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7132/api/" }),
  endpoints: (build) => ({
    chat: build.query<ChatResponse, string>({
      query: (message) => `DialogFlow/DetectIntent/${message}`
    })
  })
})

export const { useLazyChatQuery } = apiSlice;