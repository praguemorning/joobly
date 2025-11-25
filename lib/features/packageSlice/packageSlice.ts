import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PackageType } from '@/lib/types/componentTypes';

interface PackageState {
  selectedPackage: PackageType;
}

const initialState: PackageState = {
  selectedPackage: {
    title: "5 Job Postings",
    points: 5,
    percent: "30% Rebate",
    value: "1500.00 CZK",
    price: 2700,
    active: true,
  },
};

export const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    setPackage(state, action: PayloadAction<PackageType>) {
      state.selectedPackage = action.payload;
    },
  },
});

export const { setPackage } = packageSlice.actions;
export default packageSlice.reducer;