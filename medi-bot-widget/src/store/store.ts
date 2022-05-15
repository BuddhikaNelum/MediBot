import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice as chatApiSlice } from "../api/chat-bot-api-slice";
import messagesReducer from "../components/chat-slice";

const reducers = combineReducers({
  messages: messagesReducer,
  [chatApiSlice.reducerPath]: chatApiSlice.reducer,
});

export const store = configureStore({ reducer: reducers });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducers>;