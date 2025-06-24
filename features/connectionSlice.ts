import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ConnectionState = {
  apiConnected: boolean;
  socketConnected: boolean;
};

const initialState: ConnectionState = {
  apiConnected: false,
  socketConnected: false,
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setApiConnection(state, action: PayloadAction<boolean>) {
      state.apiConnected = action.payload;
    },
    setSocketConnection(state, action: PayloadAction<boolean>) {
      state.socketConnected = action.payload;
    },
    resetConnection(state) {
      state.apiConnected = false;
      state.socketConnected = false;
    }
  },
});

export const {
  setApiConnection,
  setSocketConnection,
  resetConnection
} = connectionSlice.actions;

export default connectionSlice.reducer;