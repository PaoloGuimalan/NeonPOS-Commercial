/* eslint-disable no-plusplus */
/* eslint-disable radix */
function makeID(length: number) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function dateGetter() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

  return `${mm}%2F${dd}%2F${yyyy}`;
}

function timeGetter() {
  const today = new Date();
  const hour = String(today.getHours() % 12 || 12);
  const minutes = String(today.getMinutes() >= 9 ? today.getMinutes() : `0${today.getMinutes()}`);
  const seconds = String(today.getSeconds() >= 9 ? today.getSeconds() : `0${today.getSeconds()}`);
  const timeIndicator = parseInt(hour) <= 12 ? 'am' : 'pm';

  return `${hour}:${minutes}:${seconds} ${timeIndicator}`;
}

export { makeID, dateGetter, timeGetter };
