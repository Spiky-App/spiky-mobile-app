import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { Toast } from '../../../types/store';

interface ToastState {
  queue: Toast[];
}

const initialState: ToastState = {
  queue: [],
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state: ToastState, action: PayloadAction<Toast>) => {
      const queueUpdated = [...state.queue, action.payload];
      state.queue = queueUpdated;
    },
    removeToast: (state: ToastState) => {
      const queueUpdated = state.queue.filter((_toast, index) => index != 0);
      state.queue = queueUpdated;
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export const selectToast = (state: RootState) => state.toast;

export default toastSlice.reducer;
