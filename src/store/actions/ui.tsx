import { types } from "../types";


export const uiOpenModalM = () => ({
  type: types.uiOpenModalM,
});

export const uiCloseModalM = () => ({
  type: types.uiCloseModalM,
});

export const uiOpenModalR = () => ({
  type: types.uiOpenModalR,
});

export const uiCloseModalR = () => ({
  type: types.uiCloseModalR,
});

interface IUiOpenAlertAction {
    resp: any;
}

export const uiOpenAlert = (payload : IUiOpenAlertAction) => ({
  type: types.uiOpenAlert,
  payload
});

export const uiCloseAlert = () => ({
  type: types.uiCloseAlert,
});

interface IUiSetLoadingAction {
    state: any;
}
export const uiSetLoading = (payload : IUiSetLoadingAction) => ({
  type: types.uiSetLoading,
  payload
});

interface IUiSetUniversitiesAction {
    data: any;
}
export const uiSetUniversities = (payload : IUiSetUniversitiesAction) => ({
  type: types.uiSetUniversities,
  payload
});

interface IUiOpenModalAlertAction {
    data: any;
}
export const uiOpenModalAlert = (payload : IUiOpenModalAlertAction) => ({
  type: types.uiOpenModalAlert,
  payload
});

export const uiCloseModalAlert = () => ({
  type: types.uiCloseModalAlert,
});
export const uiOpenModalReport = () => ({
  type: types.uiOpenModalReport,
});

export const uiCloseModalReport = () => ({
  type: types.uiCloseModalReport,
});

export const uiOpenModalReply = () => ({
  type: types.uiOpenModalReply,
});

export const uiCloseModalReply = () => ({
  type: types.uiCloseModalReply,
});

export const uiOpenModalNotify = () => ({
  type: types.uiOpenModalNotify,
});
export const uiCloseModalNotify = () => ({
  type: types.uiCloseModalNotify,
});

export const uiOpenModalNotifications = () => ({
  type: types.uiOpenModalNotifications,
});
export const uiCloseModalNotifications = () => ({
  type: types.uiCloseModalNotifications,
});


interface IUiOpenModalPopUpAction {
    data: any;
}
export const uiOpenModalPopUp = ( payload : IUiOpenModalPopUpAction) => ({
  type: types.uiOpenModalPopUp,
  payload
});
export const uiCloseModalPopUp = () => ({
  type: types.uiCloseModalPopUp,
});
