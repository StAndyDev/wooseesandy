import { configureStore } from '@reduxjs/toolkit'
import numberOnlineReducer from '../features/numberOnlineSlice'
import visitorsDataReducer from '../features/visitorsDataSlice'
import visitorDataApiOffsetReducer from '../features/apiOffset'

export const store = configureStore({
  reducer: {
    number_online: numberOnlineReducer,
    visitors_data: visitorsDataReducer,
    visitor_data_api_offset: visitorDataApiOffsetReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch