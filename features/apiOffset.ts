import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface apiOffsetState {
    visitorDataApiOffset: number,
}

const initialState: apiOffsetState = {
    visitorDataApiOffset: 0,
}

const visitorDataApiOffsetSlice = createSlice({
  name: 'visitor_data_api_offset',
  initialState,
  reducers: {
    setVisitorDataApiOffset: (state, action: PayloadAction<number>) => {
        state.visitorDataApiOffset = action.payload
    },
    
  },
})

export const { setVisitorDataApiOffset } = visitorDataApiOffsetSlice.actions
export default visitorDataApiOffsetSlice.reducer