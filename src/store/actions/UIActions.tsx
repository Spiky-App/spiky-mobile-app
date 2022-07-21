import { Action, Dispatch } from 'redux';
import { UniversitiesResponseData } from '../../services/models/spikyService';
import { UIActionTypes } from '../types/uiTypes';

const uiSetUniversities = (responseData: UniversitiesResponseData) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: UIActionTypes.SET_UNIVERSITIES, payload: responseData });
  };
};

export default { uiSetUniversities };
