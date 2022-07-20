import { HelperMessage, HelperMessageType } from '../types/common';
import { FormState } from '../types/login';

const helperMesasageWarning = (message: string) => {
  return { message, type: HelperMessageType.WARNING };
};

export const getFormHelperMessage = (value: string): HelperMessage | undefined => {
  if (!value) {
    return helperMesasageWarning('El campo no puede estar vacio');
  }
};

export const validateForm = (formState: FormState) => {
  const { email, password } = formState;
  if (!email) {
    return false;
  }
  if (!password) {
    return false;
  }
  return true;
};
