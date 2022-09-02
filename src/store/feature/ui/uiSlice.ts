import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ModalAlert, University } from '../../../types/store';
import { faCircleExclamation } from '../../../constants/icons/FontAwesome';

interface UIState {
    universities?: University[];
    modalAlert: ModalAlert;
}

const initialState: UIState = {
    universities: undefined,
    modalAlert: {
        isOpen: false,
        text: 'Upps...               algo salió mal',
        icon: faCircleExclamation,
        color: '#01192E',
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setUniversities: (state: UIState, action: PayloadAction<University[]>) => {
            state.universities = action.payload;
        },
        setModalAlert: (state: UIState, action: PayloadAction<ModalAlert>) => {
            state.modalAlert = action.payload;
        },
    },
});

export const { setUniversities, setModalAlert } = uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
