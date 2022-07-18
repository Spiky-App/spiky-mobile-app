export enum UIActionTypes {
    SET_UNIVERSITIES
  }
  
  interface SetUniversities {
    type: UIActionTypes.SET_UNIVERSITIES;
    payload: string;
  }
  
  export type Action = SetUniversities ;