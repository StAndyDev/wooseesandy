import { createSlice } from '@reduxjs/toolkit'

interface BaseUrlState {
    urls: Array<{
      id: number,
      protocole: string,
      host: string,
      port: string | null,
      isActiveForApi: boolean,
      isActiveForWs: boolean
    }>
    }
const initialState: BaseUrlState = {
  urls: []  // Initialize with an empty array
}
const baseUrlSlice = createSlice({
  name: 'base_url',
  initialState,
  reducers: {
    setActiveForApiUrl: (state, action) => {
      const idToActivate = action.payload
      state.urls = state.urls.map(url => ({
        ...url,
        isActiveForApi: url.id === idToActivate
      }))
    },
    setActiveForWsUrl: (state, action) => {
      const idToActivate = action.payload
      state.urls = state.urls.map(url => ({
        ...url,
        isActiveForWs: url.id === idToActivate
      }))
    },
    setUrl: (state, action) => {
      state.urls = action.payload
    },    
    addUrl: (state, action) => {
      const newUrl = {
        id: Date.now(),
        isActiveForApi: false,
        isActiveForWs: false,
        ...action.payload
      }
      state.urls.push(newUrl)
    },
    removeUrl: (state, action) => {
      state.urls = state.urls.filter(url => url.id !== action.payload)
    }
  }
})

export const {
  setActiveForApiUrl,
  setActiveForWsUrl,
  setUrl,
  addUrl,
  removeUrl
} = baseUrlSlice.actions

export default baseUrlSlice.reducer

