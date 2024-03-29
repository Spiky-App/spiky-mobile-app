import { Message as Mensaje } from '../types/services/spiky';
import { AnswerCount, Comment, Message, ReactionCount } from '../types/store';
import { generateCommentFromComentario } from './comment';

function generateMessageFromMensaje(mensaje: Mensaje, msgIndex: number = 1): Message {
    const messageTrackingId: number | undefined = mensaje?.trackings?.find(
        (tracking, index) => index === 0
    )?.id_tracking;

    const reactionsRetrived: ReactionCount[] = mensaje.reacciones.map(reaction => ({
        reaction: reaction.reaccion,
        count: reaction.count,
    }));

    const answersRetrived: AnswerCount[] | undefined = mensaje.encuesta_opciones?.map(answer => ({
        id: answer.id_encuesta_opcion,
        answer: answer.encuesta_opcion,
        count: answer.encuesta_respuestas_count,
    }));

    const commentsRetrived: Comment[] | undefined = mensaje.respuestas?.map(respuesta => {
        return generateCommentFromComentario(respuesta);
    });

    return {
        id: mensaje.id_mensaje,
        message: mensaje.mensaje,
        date: Number(mensaje.fecha),
        user: {
            id: mensaje.id_usuario,
            nickname: mensaje.usuario.alias,
            universityId: mensaje.usuario.id_universidad,
        },
        myReaction: mensaje.mi_reaccion,
        reactions: reactionsRetrived,
        messageTrackingId,
        answersNumber: mensaje.num_respuestas ?? 0,
        draft: mensaje.draft,
        sequence: msgIndex,
        comments: commentsRetrived,
        answers: answersRetrived,
        myAnswers: mensaje.mi_encuesta_respuesta,
        totalAnswers: mensaje.total_encuesta_respuestas,
    };
}

export { generateMessageFromMensaje };
