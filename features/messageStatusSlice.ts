import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid/non-secure'; // generate unique IDs

type MessageType = 'info' | 'error' | 'warning' | 'success';
type ConnexionType = 'api' | 'websocket';

type Message = {
  id: string;
  type: MessageType;
  connexion?: ConnexionType;
  content: string;
  timestamp: string;
};

type State = {
  messages: Message[];
};

const initialState: State = {
  messages: [],
};

const messageStatusSlice = createSlice({
  name: 'messages_status',
  initialState,
  reducers: {
    // add a new message
    addMessage: {
      reducer: (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
      },
      // pour preparer le payload avant d'ajouter
      prepare: (type: MessageType, connexion: ConnexionType, content: string) => {
        return {
          payload: {
            id: nanoid(),
            type,
            connexion,
            content,
            timestamp: new Date().toISOString(),
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