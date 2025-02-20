import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/redux/store/store";
import { VirtualAccountResponse } from "../types/virtualAccountType";

type virtualAccountUtilSliceType = {
    highlightedVirtualAccount: VirtualAccountResponse | null;
}

const initialState: virtualAccountUtilSliceType = {
    highlightedVirtualAccount: null
};

const virtualAccountUtilSlice = createSlice({
	name: "virtualAccount",
	initialState,
	reducers: {
        highlightVirtualAccount: (state, action: PayloadAction<VirtualAccountResponse>)=> {
            state.highlightedVirtualAccount = action.payload;
        }
	},
});

export const { highlightVirtualAccount } = virtualAccountUtilSlice.actions;
export const selectVirtualAccount = (store:RootState)=> store.virtualAccount;

export default virtualAccountUtilSlice.reducer;