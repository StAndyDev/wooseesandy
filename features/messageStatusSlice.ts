import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid/non-secure'; // generate unique IDs

type MessageType = 'info' | 'error' | 'warning' | 'success';
type ConnexionType = 'api' | 'websocket';

type Message = {
  id: string;
  type: MessageType;
  connection?: ConnexionType;
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
      prepare: (type: MessageType, connection: ConnexionType, content: string) => {
        return {
          payload: {
            id: nanoid(),
            type,
            connection,
            content,
            timestamp: new Date().toISOString(),
          },
        };
      },
    },
    // supprimer un message par ID
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== action.payload);
    },
    // vider tous les messages
    clearMessages: (state) => {
      state.messages = [];
    },
    // vider les messages selon MessageType ex : dispatch(clearMessagesByType('error'));
    clearMessagesByType: (state, action: PayloadAction<MessageType>) => {
      state.messages = state.messages.filter(m => m.type !== action.payload);
    },

    // vider les messages selon ConnexionType ex: dispatch(clearMessagesByConnexion('api'));
    clearMessagesByConnexion: (state, action: PayloadAction<ConnexionType>) => {
      state.messages = state.messages.filter(m => m.connection !== action.payload);
    },
  },
});

export const { addMessage, removeMessage, clearMessages, clearMessagesByType, clearMessagesByConnexion } = messageStatusSlice.actions;
export default messageStatusSlice.reducer;