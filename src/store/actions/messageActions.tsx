import { types } from "../types";


interface IMsgAddNewAction {
    mensaje: any;
}

const msgAddNew = (payload : IMsgAddNewAction) => ({
  type: types.msgAddNew,
  payload
});

interface IMsgSetLoadingAction {
    state: any;
}

const msgSetLoading = (payload : IMsgSetLoadingAction) => ({
  type: types.msgSetLoading,
  payload
});

interface IMsgLoadedAction {
    data: any;
}

const msgLoaded = (payload : IMsgLoadedAction) => ({
  type: types.msgLoaded,
  payload
});

interface IMsgNewLoadedAction {
    data: any;
}

export const msgNewLoaded = (payload : IMsgNewLoadedAction) => ({
  type: types.msgNewLoaded,
  payload
});

interface IMsgMoreMsgAction {
    state: any;
}

const msgMoreMsg = (payload : IMsgMoreMsgAction) => ({
  type: types.msgMoreMsg,
  payload
});

interface IMsgUpdateAction {
    data: any;
}

const msgUpdate = (payload : IMsgUpdateAction) => ({
  type: types.msgUpdate,
  payload
});

interface IMsgUpdateActiveMsgAction {
    data: any;
}
const msgUpdateActiveMsg = (payload : IMsgUpdateActiveMsgAction) => ({
  type: types.msgUpdateActiveMsg,
  payload
});

interface IMsgChangeFilterAction {
    data: any;
}
export const msgChangeFilter = (payload : IMsgChangeFilterAction) => ({
  type: types.msgFilter,
  payload
});


interface IMsgActiveMsgAction {
    data: any;
}
const msgActiveMsg = (payload : IMsgActiveMsgAction) => ({
  type: types.msgActiveMsg,
  payload
});

interface IMsgDeleteMsgAction {
    data: any;
}
export const msgActionDeleteMsg = (payload : IMsgDeleteMsgAction) => ({
  type: types.msgDeleteMsg,
  payload
});

export const msgDisableMsg = () => ({
  type: types.msgDisableMsg,
});

export const msgLogout = () => ({
  type: types.msgLogout,
});
