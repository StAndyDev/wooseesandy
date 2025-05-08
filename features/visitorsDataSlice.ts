import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VisitorDatasState {
    formData: {
        message_type: string;   // (common)
        unique_key: string; // unique key for each visitor // (common)
        date_sort: string; // date for sorting // (common)
        visitor_uuid: string; // (common)
        visit_info_uuid: string;
        alert_new_visitor: string;
        alert_returning_visitor: string;
        visit_start_datetime: string;
        visit_end_datetime: string;
        visit_duration: string;
        navigator_info: string;
        os: string;
        device_type: string;
        ip_address: string;
        location_approx: string;
        is_read: boolean;   // (common)
        // other properties for cv-download
        id_cv_download : string;
        download_datetime : string;
        // other properties for portfolio_detail_view
        id_portfolio_detail_view : string;
        project_name : string;
        project_type : string;
        view_datetime : string;

    }[];
}

const initialState: VisitorDatasState = {
    formData: []
};
// other functions 

// Slice
const visitorsDataSlice = createSlice({
    name: 'visitors_data',
    initialState,
    reducers: {
        // Tri ascendant : du plus ancien au plus récent
        sortDataByDateAsc(state) {
            state.formData.sort((a, b) =>
                new Date(a.date_sort).getTime() - new Date(b.date_sort).getTime()
            );
        },

        // Tri descendant : du plus récent au plus ancien
        sortDataByDateDesc(state) {
            state.formData.sort((a, b) =>
                new Date(b.date_sort).getTime() - new Date(a.date_sort).getTime()
            );
        },      
        addDataAtBeginning(state, action: PayloadAction<any>) {
            const exists = state.formData.some(
                id => id.unique_key === action.payload.unique_key
            );
            if (!exists) {
                state.formData.unshift(action.payload);
            }
        },
        addDataAtEnd(state, action: PayloadAction<any>) {
            const exists = state.formData.some(
                id => id.unique_key === action.payload.unique_key
            );
            if (!exists) {
                state.formData.push(action.payload);
            }
        },

        updateVisitEndDatetime(state, action: PayloadAction<{ visit_info_uuid: string; visit_end_datetime: string }>) {
            const { visit_info_uuid, visit_end_datetime } = action.payload;
            const visitor_info = state.formData.find(visitor_info => visitor_info.visit_info_uuid === visit_info_uuid);
            if (visitor_info) {
                visitor_info.visit_end_datetime = visit_end_datetime;
            }
        },
        updateVisitDuration(state, action: PayloadAction<{ visit_info_uuid: string; visit_duration: string }>) {
            const { visit_info_uuid, visit_duration } = action.payload;
            const visitor_info = state.formData.find(visitor_info => visitor_info.visit_info_uuid === visit_info_uuid);
            if (visitor_info) {
                visitor_info.visit_duration = visit_duration;
            }
        },
        markAsRead(state, action: PayloadAction<{ unique_key: string }>) {
            const { unique_key } = action.payload;
            const visitor_info = state.formData.find(visitor_info => visitor_info.unique_key === unique_key);
            if (visitor_info) {
            visitor_info.is_read = true;
            }
        }
    }
});

// Export des actions et du reducer
export const { addDataAtBeginning, addDataAtEnd, updateVisitEndDatetime, updateVisitDuration, sortDataByDateDesc, markAsRead } = visitorsDataSlice.actions;
export default visitorsDataSlice.reducer;