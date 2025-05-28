import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CountState {
    visitor_count: number,
    cv_download_count: number,
    portfolio_details_view_count: number,
    /* visit info per month */
    // visit info
    current_month_visits: number,
    last_month_visits: number,
    visit_info_per_month_percentage : number,
    // cv download
    current_month_cv_download: number,
    last_month_cv_download: number,
    cv_download_per_month_percentage : number,
    // portfolio detail
    current_month_portfolio_detail: number,
    last_month_portfolio_detail: number,
    portfolio_detail_per_month_percentage : number,
}

const initialState: CountState = {
    visitor_count: 0,
    cv_download_count: 0,
    portfolio_details_view_count: 0,
    current_month_visits: 0,
    last_month_visits: 0,
    visit_info_per_month_percentage: 0.0,
    current_month_cv_download: 0,
    last_month_cv_download: 0,
    cv_download_per_month_percentage : 0.0,
    current_month_portfolio_detail: 0,
    last_month_portfolio_detail: 0,
    portfolio_detail_per_month_percentage : 0.0,
}

const countSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addVisitorCount: (state, action: PayloadAction<number>) => {
      state.visitor_count += action.payload
    },
    addCvDownloadCount: (state, action: PayloadAction<number>) =>  {
      state.cv_download_count += action.payload
    },
    addVuesPortfolioDetailsCount: (state, action: PayloadAction<number>) =>  {
      state.portfolio_details_view_count += action.payload
    },
    /* monthly */
    // visit info
    addCurrentMonthVisits: (state, action: PayloadAction<number>) =>  {
      state.current_month_visits += action.payload
    },
    addLastMonthVisits: (state, action: PayloadAction<number>) => {
      state.last_month_visits = action.payload
    },
    setCurrentMonthVisits: (state, action: PayloadAction<number>) =>  {
      state.current_month_visits = action.payload
    },
    setLastMonthVisits: (state, action: PayloadAction<number>) => {
      state.last_month_visits = action.payload
    },
    setVisitInfoPercentageMonthly: (state, action: PayloadAction<number>) => {
      state.visit_info_per_month_percentage = action.payload
    },
    // cv download
    addCurrentMonthCvDownload: (state, action: PayloadAction<number>) =>  {
      state.current_month_cv_download += action.payload
    },
    addLastMonthCvDownload: (state, action: PayloadAction<number>) => {
      state.last_month_cv_download += action.payload
    },
    setCurrentMonthCvDownload: (state, action: PayloadAction<number>) =>  {
      state.current_month_cv_download = action.payload
    },
    setLastMonthCvDownload: (state, action: PayloadAction<number>) => {
      state.last_month_cv_download = action.payload
    },
    setCvDownloadPercentageMonthly: (state, action: PayloadAction<number>) => {
      state.cv_download_per_month_percentage = action.payload
    },
    // portfolio detail
    addCurrentMonthPortfolioDetail: (state, action: PayloadAction<number>) =>  {
      state.current_month_portfolio_detail += action.payload
    },
    addLastMonthPortfolioDetail: (state, action: PayloadAction<number>) => {
      state.last_month_portfolio_detail += action.payload
    },
    setCurrentMonthPortfolioDetail: (state, action: PayloadAction<number>) =>  {
      state.current_month_portfolio_detail = action.payload
    },
    setLastMonthPortfolioDetail: (state, action: PayloadAction<number>) => {
      state.last_month_portfolio_detail = action.payload
    },
    setPortfolioDetailPercentageMonthly: (state, action: PayloadAction<number>) => {
      state.portfolio_detail_per_month_percentage = action.payload
    },
    
  },
})

export const { 
  addVisitorCount, 
  addCvDownloadCount, 
  addVuesPortfolioDetailsCount, 
  addCurrentMonthVisits, 
  addLastMonthVisits,
  setCurrentMonthVisits,
  setLastMonthVisits,
  setVisitInfoPercentageMonthly,
  setCurrentMonthCvDownload,
  setLastMonthCvDownload,
  setCurrentMonthPortfolioDetail,
  setLastMonthPortfolioDetail,
  addCurrentMonthCvDownload,
  addLastMonthCvDownload,
  setCvDownloadPercentageMonthly,
  addCurrentMonthPortfolioDetail,
  addLastMonthPortfolioDetail,
  setPortfolioDetailPercentageMonthly

} = countSlice.actions    // exporter les "Actions"
export default countSlice.reducer // exporter le "Reducer"