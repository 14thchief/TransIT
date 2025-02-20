import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusinessType } from "../types/businessType";
import { RootState } from "src/redux/store/store";

type BusinessSliceType = {
    highlightedBusiness: BusinessType | null;
}

const initialState: BusinessSliceType = {
    highlightedBusiness: null
};

const businessSlice = createSlice({
	name: "business",
	initialState,
	reducers: {
        highlightBusiness: (state, action: PayloadAction<BusinessType | null>)=> {
            state.highlightedBusiness = action.payload;
        }
	},
});

export const { highlightBusiness } = businessSlice.actions;
export const selectBusiness = (store:RootState)=> store.business;

export default businessSlice.reducer;
