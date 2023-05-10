import { Mood as Estado } from '../types/services/spiky';
import { Mood } from '../types/store';
import { getTime } from './getTime';

function generateMoodFromEstado(mood: Estado): Mood {
    return {
        id: mood.id_mensaje,
        mood: mood.mensaje.substring(mood.mensaje.indexOf('|') + 1),
        emoji: mood.mensaje.substring(0, mood.mensaje.indexOf('|')),
        date: getTime(mood.fecha),
    };
}

export { generateMoodFromEstado };
