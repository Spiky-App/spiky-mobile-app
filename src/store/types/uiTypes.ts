import { Universidad } from '../../services/models/spikyService';

export enum UIActionTypes {
    SET_UNIVERSITIES,
}

interface SetUniversities {
    type: UIActionTypes.SET_UNIVERSITIES;
    payload: Universidad[];
}

export type Action = SetUniversities;
