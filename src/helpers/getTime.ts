export const getTime = (fecha: string) => {
    const value: any = Date.now() - parseInt(fecha, 10);
    const milisec = parseInt(value, 10);
    const sec = Math.floor(milisec / 1000);
    if (sec < 60) {
        return 'ahora';
    }

    const minutes = Math.floor(sec / 60);
    if (minutes < 60) {
        return minutes + ' min';
    }

    const hours = Math.floor(sec / 3600);
    if (hours < 24) {
        return hours + ' hrs';
    }
    if (hours === 24) {
        return '1 dia';
    }

    const days = Math.floor(hours / 24);
    if (days < 15) {
        return days + ' dias';
    }
    const date = new Date(parseInt(fecha, 10));

    return (
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear().toString().substring(2, 4)
    );
};
