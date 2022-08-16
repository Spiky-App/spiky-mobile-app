import { Message as Mensaje } from '../types/services/spiky';
import { Message, ReactionType, User } from '../types/store';

function generateMessageFromMensaje(mensaje: Mensaje, user: User): Message {
    const reactionType: ReactionType | undefined = mensaje?.reacciones?.find(
        (reaccion, index) => index === 0
    )?.tipo;
    const messageTrackingId: number | undefined = mensaje?.trackings?.find(
        (tracking, index) => index === 0
    )?.id_tracking;
    return {
        id: mensaje.id_mensaje,
        message: mensaje.mensaje,
        date: Number(mensaje.fecha),
        favor: mensaje.favor,
        neutral: mensaje.neutro,
        against: mensaje.contra,
        user,
        reactionType,
        messageTrackingId,
        answersNumber: mensaje.num_respuestas ?? 0,
        draft: mensaje.draft,
    };
}

export { generateMessageFromMensaje };
