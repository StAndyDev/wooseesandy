import { configureStore } from '@reduxjs/toolkit'
import apiOffsetReducer from '../features/apiOffset'
import baseUrlSlice from '../features/baseUrlConfigSlice'
import connectionReducer from '../features/connectionSlice'
import countReducer from '../features/counterSlice'
import messageStatusSlice from '../features/messageStatusSlice'
import numberNotificationReducer from '../features/numberNotificationSlice'
import numberOnlineReducer from '../features/numberOnlineSlice'
import visitorsDataReducer from '../features/visitorsDataSlice'


export const store = configureStore({
  reducer: {
    number_online: numberOnlineReducer,
    visitors_data: visitorsDataReducer,
    api_offset: apiOffsetReducer,
    number_notification: numberNotificationReducer,
    counter: countReducer,
    base_url: baseUrlSlice,
    messages_status: messageStatusSlice,
    connection : connectionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch