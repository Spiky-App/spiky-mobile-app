import { Dispatch } from 'react';
import { MessagesResponseData } from '../../services/models/spikyService';
import { Action, MessagesActionTypes } from '../types/ideasTypes';

const getAllMessages = (responseData: MessagesResponseData) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: MessagesActionTypes.GET_EVERY_MESSAGE, payload: responseData });
  };
};

export default { getAllMessages };