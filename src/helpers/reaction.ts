import {
    CommentReaction,
    Reaction as Reaccion,
    X2Reaction as X2Reaccion,
} from '../types/services/spiky';
import { Reaction, X2Reaction } from '../types/store';

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

function generateX2ReactionFromX2Reaccion(x2reaction: X2Reaccion): X2Reaction {
    return {
        messageID: x2reaction.mensaje_parent.id_mensaje,
        user: {
            nickname: x2reaction.mensaje_parent.usuario.alias,
            universityId: x2reaction.mensaje_parent.usuario.id_universidad,
        },
        xNummber: x2reaction.row_num,
    };
}

export {
    generateReactionFromReaccion,
    generateCommentReactionFromRespReaccion,
    generateX2ReactionFromX2Reaccion,
};
