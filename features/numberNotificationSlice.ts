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
    // ADD UNREAD
    addUnreadVisitorInfo(state, action: PayloadAction<number>) {
      state.unread.visitinfo_count += action.payload
    },
    addUnreadCvDownload(state, action: PayloadAction<number>) {
      state.unread.cvdownload_count += action.payload
    },
    addUnreadPortfolioDetailView(state, action: PayloadAction<number>) {
      state.unread.portfoliodetailview_count += action.payload
    },
    // REMOVE UNREAD
    removeUnreadVisitorInfo(state, action: PayloadAction<number>) {
      state.unread.visitinfo_count -= action.payload
    },
    removeUnreadCvDownload(state, action: PayloadAction<number>) {
      state.unread.cvdownload_count -= action.payload
    },
    removeUnreadPortfolioDetailView(state, action: PayloadAction<number>) {
      state.unread.portfoliodetailview_count -= action.payload
    }

  },
})

// Export des actions et du reducer
export const { setReadNotificationCount, setUnreadNotificationCount, addUnreadVisitorInfo, addUnreadCvDownload, addUnreadPortfolioDetailView, removeUnreadVisitorInfo, removeUnreadCvDownload, removeUnreadPortfolioDetailView } = numberNotificationSlice.actions
export default numberNotificationSlice.reducer