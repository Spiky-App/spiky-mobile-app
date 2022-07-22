import { Dispatch } from 'redux';
import { UniversitiesResponseData } from '../../services/models/spikyService';
import { Action, UIActionTypes } from '../types/uiTypes';


const uiSetUniversities = (responseData: UniversitiesResponseData) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: UIActionTypes.SET_UNIVERSITIES, payload: responseData.universidades });
  };
};

export default { uiSetUniversities };