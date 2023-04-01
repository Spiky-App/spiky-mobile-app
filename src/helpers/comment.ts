import { Comment as Comentario } from '../types/services/spiky';
import { Comment, ReactionCount } from '../types/store';

function generateCommentFromComentario(comentario: Comentario): Comment {
    const reactionsRetrived: ReactionCount[] = comentario.resp_reacciones.map(reaction => ({
        reaction: reaction.reaccion,
        count: reaction.count,
    }));
    return {
        id: comentario.id_respuesta,
        comment: comentario.respuesta,
        date: Number(comentario.fecha),
        messageId: comentario.id_mensaje,
        reactions: reactionsRetrived,
        user: {
            id: comentario.usuario.id_usuario,
            nickname: comentario.usuario.alias,
            universityId: comentario.usuario.id_universidad,
        },
        myReaction: comentario.mi_resp_reaccion,
    };
}

export { generateCommentFromComentario };
