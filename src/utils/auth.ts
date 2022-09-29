import { decode } from 'base-64';
export const decodeToken = (token: string) => {
    return decodeURIComponent(
        decode(token.split('.')[1].replace('-', '+').replace('_', '/'))
            .split('')
            .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    );
};
