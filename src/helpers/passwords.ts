import { Toast } from '../types/store';
import { StatusType } from '../types/common';

function validatePasswordFields(
    password: string,
    passwordValid: boolean,
    confirmPassword: string
): Toast | undefined {
    if (passwordValid && password === confirmPassword) {
        return undefined;
    } else if (!passwordValid) {
        return {
            message: 'La contraseña no cumple los criterios',
            type: StatusType.WARNING,
        };
    } else if (password !== confirmPassword) {
        return {
            message: 'Las contraseñas no coinciden',
            type: StatusType.WARNING,
        };
    }
}

export { validatePasswordFields };
