import { FormState } from '../types/forgotPass';

export const validateForm = (formState: FormState) => {
    const { email } = formState;
    if (!email) {
        return false;
    }
    return true;
};
