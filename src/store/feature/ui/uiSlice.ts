import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ModalAlert, Topic, University } from '../../../types/store';
import { faCircleExclamation } from '../../../constants/icons/FontAwesome';

interface UIState {
    universities?: University[];
    modalAlert: ModalAlert;
    appState: 'active' | 'inactive';
    spectatorMode: boolean;
    topics?: Topic[];
}

const initialState: UIState = {
    universities: undefined,
    modalAlert: {
        isOpen: false,
        text: 'Upps...               algo salió mal',
        icon: faCircleExclamation,
        color: '#01192E',
    },
    appState: 'active',
    spectatorMode: false,
    topics: undefined,
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
        setAppState: (state: UIState, action: PayloadAction<'active' | 'inactive'>) => {
            state.appState = action.payload;
        },
        toggleSpectatorMode: (state: UIState) => {
            state.spectatorMode = !state.spectatorMode;
        },
        setTopics: (state: UIState, action: PayloadAction<Topic[]>) => {
            state.topics = action.payload;
        },
    },
});

export const { setUniversities, setModalAlert, setAppState, toggleSpectatorMode, setTopics } =
    uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
