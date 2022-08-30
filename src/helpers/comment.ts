import { Comment as Comentario } from '../types/services/spiky';
import { Comment, ReactionType } from '../types/store';

function generateCommentFromComentario(comentario: Comentario): Comment {
    const reactionCommentType: ReactionType | undefined = comentario?.resp_reacciones?.find(
        (reaccion, index) => index === 0
    )?.tipo;
    return {
        id: comentario.id_respuesta,
        comment: comentario.respuesta,
        date: Number(comentario.fecha),
        messageId: comentario.id_mensaje,
        favor: comentario.resp_reaccion_1 || 0,
        against: comentario.resp_reaccion_2 || 0,
        user: {
            id: comentario.id_usuario,
            nickname: comentario.usuario.alias,
            university: {
                shortname: comentario.usuario.universidad.alias,
            },
        },
        reactionCommentType,
    };
}

export { generateCommentFromComentario };
