import { Reaction as Reaccion } from '../types/services/spiky';
import { Reaction } from '../types/store';

function generateReactionFromReaccion(reaccion: Reaccion): Reaction {
    return {
        id: reaccion.id_reaccion,
        reaction: reaccion.reaccion,
        user: {
            nickname: reaccion.usuario.alias,
            universityId: reaccion.usuario.id_universidad,
        },
    };
}

export { generateReactionFromReaccion };
