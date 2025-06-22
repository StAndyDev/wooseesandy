import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid/non-secure'; // generate unique IDs

type MessageType = 'info' | 'error' | 'warning' | 'success';

type Message = {
  id: string;
  type: MessageType;
  content: string;
};

type State = {
  messages: Message[];
};

// const initialState: State = {
//   messages: [],
// };

const initialState: State = {
  messages: 
  [
    {
      id: nanoid(),
      type: 'info',
      content: 'Welcome to the application!',
    },
    {
      id: nanoid(),
      type: 'error',
      content: 'An error occurred while processing your request.',
    }
  ],
};

const messageStatusSlice = createSlice({
  name: 'messages_status',
  initialState,
  reducers: {
    addMessage: {
      reducer: (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
      },
      prepare: (type: MessageType, content: string) => {
        return {
          payload: {
            id: nanoid(),
            type,
            content,
          },
        };
      },
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, removeMessage, clearMessages } = messageStatusSlice.actions;
export default messageStatusSlice.reducer;