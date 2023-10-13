import {
    Idea as Mensaje,
    ReactionCount as ReaccionesCount,
    AnswerCount as RespuestasCount,
    Comment as Comentario,
    ChildMessage as MensajeChild,
    TopicQuestion,
} from '../types/services/spiky';
import { AnswerCount, Comment, Idea, ReactionCount } from '../types/store';
import { generateCommentFromComentario } from './comment';

function generateMessageFromMensaje(mensaje: Mensaje, msgIndex: number = 1): Idea {
    const messageTrackingId: number | undefined = mensaje?.trackings?.find(
        (tracking, index) => index === 0
    )?.id_tracking;

    const mensaje_child = childMessageRetrived(msgIndex, mensaje.mensaje_child);

    const topic_question = mensaje.topic_question
        ? topicQuestionRetrived(mensaje.topic_question)
        : undefined;

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
        reactions: reactionsRetrived(mensaje.reacciones),
        messageTrackingId,
        totalComments: mensaje.num_respuestas ?? 0,
        totalX2: mensaje.num_x2 ?? 0,
        myX2: mensaje.mi_x2,
        type: mensaje.type,
        sequence: msgIndex,
        comments: commentsRetrived(mensaje.respuestas),
        answers: answersRetrived(mensaje.encuesta_opciones),
        myAnswers: mensaje.mi_encuesta_respuesta,
        totalAnswers: mensaje.total_encuesta_respuestas,
        childMessage: mensaje_child,
        topicQuestion: topic_question,
        anonymous: mensaje.anonymous,
    };
}

function reactionsRetrived(reacciones: ReaccionesCount[]) {
    const reactions: ReactionCount[] = reacciones.map(reaction => ({
        reaction: reaction.reaccion,
        count: reaction.count,
    }));
    return reactions;
}

function answersRetrived(encuesta_opciones: RespuestasCount[]) {
    const answers: AnswerCount[] = encuesta_opciones.map(answer => ({
        id: answer.id_encuesta_opcion,
        answer: answer.encuesta_opcion,
        count: answer.encuesta_respuestas_count,
    }));
    return answers;
}

function commentsRetrived(comentarios?: Comentario[]) {
    const comments: Comment[] | undefined = comentarios?.map(comentario => {
        return generateCommentFromComentario(comentario);
    });
    return comments;
}

export function topicQuestionRetrived(topic_question: TopicQuestion) {
    return {
        id: topic_question.id_topic_question,
        question: topic_question.question,
        topic: {
            id: topic_question.topic.id_topic,
            name: topic_question.topic.name,
            emoji: topic_question.topic.emoji,
            backgroundColor: topic_question.topic.background_color,
        },
        totalIdeas: topic_question.num_mensajes,
    };
}

function childMessageRetrived(msgIndex: number, mensaje_child?: MensajeChild) {
    if (mensaje_child) {
        return {
            id: mensaje_child.id_mensaje,
            message: mensaje_child.mensaje,
            date: Number(mensaje_child.fecha),
            user: {
                id: mensaje_child.id_usuario,
                nickname: mensaje_child.usuario.alias,
                universityId: mensaje_child.usuario.id_universidad,
            },
            myReaction: mensaje_child.mi_reaccion,
            reactions: reactionsRetrived(mensaje_child.reacciones),
            totalComments: mensaje_child.num_respuestas ?? 0,
            totalX2: mensaje_child.num_x2 ?? 0,
            myX2: mensaje_child.mi_x2,
            type: mensaje_child.type,
            sequence: msgIndex,
            comments: commentsRetrived(mensaje_child.respuestas),
            answers: answersRetrived(mensaje_child.encuesta_opciones),
            myAnswers: mensaje_child.mi_encuesta_respuesta,
            totalAnswers: mensaje_child.total_encuesta_respuestas,
            anonymous: mensaje_child.anonymous,
        };
    } else {
        return undefined;
    }
}

export { generateMessageFromMensaje };
