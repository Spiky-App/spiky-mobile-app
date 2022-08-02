import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { University } from '../../../types/store/common';

interface UIState {
  universities?: University[];
}

const initialState: UIState = {
  universities: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUniversities: (state: UIState, action: PayloadAction<University[]>) => {
      state.universities = action.payload;
    },
  },
});

export const { setUniversities } = uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
