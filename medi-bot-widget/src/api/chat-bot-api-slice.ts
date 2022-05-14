import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "chat",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (build) => ({
    chat: build.query({
      query: () => ""
    })
  })
})

export const { useLazyChatQuery } = apiSlice;