import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/store/store";

type EnvironmentSliceType = {
    environment: EnvironmentType;
}

const initialState: EnvironmentSliceType = {
    environment: "test"
};

const environmentSlice = createSlice({
	name: "environment",
	initialState,
	reducers: {
        toggleEnvironment: (state)=> {
            state.environment = state.environment === "live"? "test" : "live";
        }
	},
});

export const { toggleEnvironment } = environmentSlice.actions;
export const selectEnvironment = (store:RootState)=> store.env;

export default environmentSlice.reducer;
