import { CommentReaction, Reaction as Reaccion } from '../types/services/spiky';
import { Reaction } from '../types/store';

function generateReactionFromReaccion(reaction: Reaccion): Reaction {
    return {
        id: reaction.id_reaccion,
        reaction: reaction.reaccion,
        user: {
            nickname: reaction.usuario.alias,
            universityId: reaction.usuario.id_universidad,
        },
    };
}

function generateCommentReactionFromRespReaccion(reaction: CommentReaction): Reaction {
    return {
        id: reaction.id_resp_reaccion,
        reaction: reaction.reaccion,
        user: {
            nickname: reaction.usuario.alias,
            universityId: reaction.usuario.id_universidad,
        },
    };
}

export { generateReactionFromReaccion, generateCommentReactionFromRespReaccion };
