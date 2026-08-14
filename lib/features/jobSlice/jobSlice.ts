import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JobData } from "@/lib/types/componentTypes";
import { BACKEND_URL } from "@/lib/constant/constants";
import { JobTypes } from "@/models/Job";

export interface JobState {
	jobDetails: JobData | null;
}

const initialState: JobState = {
	jobDetails: null,
};

export const addNewJob = createAsyncThunk(
	"jobs/create-job",
	async (data: JobTypes, { rejectWithValue }): Promise<any> => {
		try {
			const response = await fetch(`/jobs/api/jobs`, {
				method: "POST",
				cache: "no-cache",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.json();
		} catch (e: any) {
			return rejectWithValue(e.response.data);
		}
	},
);
export const jobSlice = createSlice({
	name: "job",
	initialState,
	reducers: {
		setJobDetails: (state, action: PayloadAction<any>) => {
			state.jobDetails = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(addNewJob.fulfilled, (state, action) => {});
	},
});

// Action creators are generated for each case reducer function
export const { setJobDetails } = jobSlice.actions;

export default jobSlice.reducer;
