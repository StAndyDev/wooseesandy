import { configureStore } from '@reduxjs/toolkit'
import numberOnlineReducer from '../features/numberOnlineSlice'
import visitorsDataReducer from '../features/visitorsDataSlice'
import apiOffsetReducer from '../features/apiOffset'

export const store = configureStore({
  reducer: {
    number_online: numberOnlineReducer,
    visitors_data: visitorsDataReducer,
    api_offset: apiOffsetReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch