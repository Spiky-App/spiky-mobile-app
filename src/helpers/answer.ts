import { PollAnswer as Respuesta } from '../types/services/spiky';
import { Answer, User } from '../types/store';

function generateAnswerFromRespuesta(answer: Respuesta): Answer {
    const answersRetrived: User[] = answer.encuesta_respuestas.map(a => ({
        nickname: a.usuario.alias,
        universityId: a.usuario.id_universidad,
    }));
    return {
        id: answer.id_encuesta_opcion,
        answer: answer.encuesta_opcion,
        count: answer.count,
        votes: answersRetrived,
    };
}

export { generateAnswerFromRespuesta };
