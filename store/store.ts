import { configureStore } from '@reduxjs/toolkit'
import apiOffsetReducer from '../features/apiOffset'
import numberNotificationReducer from '../features/numberNotificationSlice'
import numberOnlineReducer from '../features/numberOnlineSlice'
import visitorsDataReducer from '../features/visitorsDataSlice'

export const store = configureStore({
  reducer: {
    number_online: numberOnlineReducer,
    visitors_data: visitorsDataReducer,
    api_offset: apiOffsetReducer,
    number_notification: numberNotificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch