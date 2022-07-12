export const getTime = (fecha: string) => {
  
  const value:any = Date.now() - parseInt(fecha);
  const milisec = parseInt(value, 10); // convert value to number if it's string
  let sec = Math.floor(milisec / 1000);
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds

  if (hours > 24) {
    return Math.floor(hours / 24) + ' days';
  }
  if (hours > 1) {
    return hours + ' hrs';
  }
  if (minutes > 1) {
    return minutes + ' min';
  }
  return seconds + ' sec';
};
