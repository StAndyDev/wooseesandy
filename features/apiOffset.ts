import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface apiOffsetState {
    visitorDataApiOffset: number,
    cvDownloadsApiOffset: number,
    portfolioDetailsViewApiOffset: number,
}

const initialState: apiOffsetState = {
    visitorDataApiOffset: 0,
    cvDownloadsApiOffset: 0,
    portfolioDetailsViewApiOffset: 0,
}

const apiOffsetSlice = createSlice({
  name: 'api_offset',
  initialState,
  reducers: {
    setVisitorDataApiOffset: (state, action: PayloadAction<number>) => {
        state.visitorDataApiOffset = action.payload
    },
    setCVDownloadsApiOffset: (state, action: PayloadAction<number>) => {
        state.cvDownloadsApiOffset = action.payload
    },
    setPortfolioDetailsViewApiOffset: (state, action: PayloadAction<number>) => {
        state.portfolioDetailsViewApiOffset = action.payload
    },
    
  },
})

export const { setVisitorDataApiOffset, setCVDownloadsApiOffset, setPortfolioDetailsViewApiOffset } = apiOffsetSlice.actions
export default apiOffsetSlice.reducer