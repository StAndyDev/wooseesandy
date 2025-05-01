import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VisitorDatasState {
    formData: {
        alert_type: string;
        visitor_uuid: string;
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
        is_read: boolean;        
    }[];
}

const initialState: VisitorDatasState = {
    formData: []
};

// Slice
const visitorsDataSlice = createSlice({
    name: 'visitors_data',
    initialState,
    reducers: {
        addVisitor(state, action: PayloadAction<any>) {
            state.formData = [action.payload, ...state.formData]
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
        }
    }
});

// Export des actions et du reducer
export const { addVisitor, updateVisitEndDatetime, updateVisitDuration } = visitorsDataSlice.actions;
export default visitorsDataSlice.reducer;