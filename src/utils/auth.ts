export const parseTokenToHeader = () => {
    const token = localStorage.getItem('token') || '';
    try {
        return { 'x-token': token };
    } catch (error) {
        return {};
    }
};
