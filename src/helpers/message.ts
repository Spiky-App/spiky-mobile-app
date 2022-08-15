import { Message as Mensaje } from '../types/services/spiky';
import { Message, Reaction, Tracking, User } from '../types/store';

function generateMessageFromMensaje(mensaje: Mensaje, user: User): Message {
    const reactions = mensaje?.reacciones?.map<Reaction>(reaccion => ({
        type: reaccion.tipo,
    }));
    const trackings = mensaje?.trackings?.map<Tracking>(tracking => ({
        id: tracking.id_tracking,
    }));
    return {
        id: mensaje.id_mensaje,
        message: mensaje.mensaje,
        date: Number(mensaje.fecha),
        favor: mensaje.favor,
        neutral: mensaje.neutro,
        against: mensaje.contra,
        user,
        reactions: reactions ?? [],
        trackings: trackings ?? [],
        answersNumber: mensaje.num_respuestas ?? 0,
        draft: mensaje.draft,
    };
}

export { generateMessageFromMensaje };
