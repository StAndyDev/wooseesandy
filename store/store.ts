import { configureStore } from '@reduxjs/toolkit'
import onlineReducer from '../features/online/onlineSlice'

export const store = configureStore({
  reducer: {
    online: onlineReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch