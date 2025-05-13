import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Count {
  visitinfo_count: number,
  cvdownload_count: number,
  portfoliodetailview_count: number,
}

interface NumberNotificationState {
  read: Count,
  unread: Count
}

const initialState: NumberNotificationState = {
  read: {
    visitinfo_count: 0,
    cvdownload_count: 0,
    portfoliodetailview_count: 0,
  },
  unread: {
    visitinfo_count: 0,
    cvdownload_count: 0,
    portfoliodetailview_count: 0,
  },
}

const numberNotificationSlice = createSlice({
  name: 'number_notification',
  initialState,
  reducers: {
    //set
    setReadNotificationCount(state, action: PayloadAction<Count>) {
      state.read = action.payload
    },
    setUnreadNotificationCount(state, action: PayloadAction<Count>) {
      state.unread = action.payload
    },
  },
})

// Export des actions et du reducer
export const { setReadNotificationCount, setUnreadNotificationCount } = numberNotificationSlice.actions
export default numberNotificationSlice.reducer