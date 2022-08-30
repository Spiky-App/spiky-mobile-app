import { Message as Mensaje } from '../types/services/spiky';
import { Comment, Message, ReactionType } from '../types/store';
import { generateCommentFromComentario } from './comment';

function generateMessageFromMensaje(mensaje: Mensaje, msgIndex: number = 1): Message {
    const reactionType: ReactionType | undefined = mensaje?.reacciones?.find(
        (reaccion, index) => index === 0
    )?.tipo;
    const messageTrackingId: number | undefined = mensaje?.trackings?.find(
        (tracking, index) => index === 0
    )?.id_tracking;

    const commentsRetrived: Comment[] | undefined = mensaje.respuestas?.map(respuesta => {
        return generateCommentFromComentario(respuesta);
    });

    return {
        id: mensaje.id_mensaje,
        message: mensaje.mensaje,
        date: Number(mensaje.fecha),
        favor: mensaje.favor,
        neutral: mensaje.neutro,
        against: mensaje.contra,
        user: {
            id: mensaje.id_usuario,
            nickname: mensaje.usuario.alias,
            university: {
                shortname: mensaje.usuario.universidad.alias,
            },
        },
        reactionType,
        messageTrackingId,
        answersNumber: mensaje.num_respuestas ?? 0,
        draft: mensaje.draft,
        sequence: msgIndex,
        comments: commentsRetrived,
    };
}

export { generateMessageFromMensaje };
