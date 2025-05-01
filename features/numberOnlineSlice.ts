import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NumberOnlineState {
    registered_visitor: number,
    new_visitor: number,
}

const initialState: NumberOnlineState = {
    registered_visitor: 0,
    new_visitor: 0,
}

const numberOnlineSlice = createSlice({
  name: 'number_online',
  initialState,
  reducers: {
    resetOnlineVisitor: (state) => {
        state.registered_visitor = 0
        state.new_visitor = 0
    },
    addRegisteredVisitorOnline: (state, action: PayloadAction<number>) => {
        state.registered_visitor += action.payload
    },
    removeRegisteredVisitorOnline: (state, action: PayloadAction<number>) => {
        state.registered_visitor < action.payload ? state.registered_visitor = 0 : state.registered_visitor -= action.payload
    },
    addNewVisitorOnline: (state, action: PayloadAction<number>) => {
        state.new_visitor += action.payload
    },
    removeNewVisitorOnline: (state, action: PayloadAction<number>) => {
        state.new_visitor < action.payload ? state.new_visitor = 0 : state.new_visitor -= action.payload
    },

  },
})

export const { addRegisteredVisitorOnline, removeRegisteredVisitorOnline, addNewVisitorOnline, removeNewVisitorOnline, resetOnlineVisitor } = numberOnlineSlice.actions    // exporter les "Actions"
export default numberOnlineSlice.reducer // exporter le "Reducer"