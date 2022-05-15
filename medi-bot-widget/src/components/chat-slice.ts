import { Message } from "@progress/kendo-react-conversational-ui";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

interface IMessagesState {
  thread: Array<Message>;
}

const initialState: IMessagesState = {
  thread: []
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state: IMessagesState, action: PayloadAction<Message>) => {
      state.thread.push(action.payload);
    }
  }
});

export const { addMessage } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages.thread;

export default messagesSlice.reducer;