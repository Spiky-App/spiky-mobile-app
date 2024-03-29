import {
    Conversation as Conversacion,
    ChatMessage as ChatMensaje,
    Seen as Vistos,
} from '../types/services/spiky';
import { Conversation, ChatMessage, Seen } from '../types/store';

function generateConversationFromConversacion(
    conversacion: Conversacion,
    uid: number
): Conversation {
    const chatsMsgRetrived: ChatMessage = generateChatMsgFromChatMensaje(
        conversacion.chatmensajes,
        uid
    );

    return {
        id: conversacion.id_conversacion,
        user_1: {
            id: conversacion.usuario1.id_usuario,
            nickname: conversacion.usuario1.alias,
            universityId: conversacion.usuario1.id_universidad,
            online: conversacion.usuario1.online,
            disable: conversacion.usuario1.disable,
        },
        user_2: {
            id: conversacion.usuario2.id_usuario,
            nickname: conversacion.usuario2.alias,
            universityId: conversacion.usuario2.id_universidad,
            online: conversacion.usuario2.online,
            disable: conversacion.usuario2.disable,
        },
        chatmessage: chatsMsgRetrived,
    };
}

function generateChatMsgFromChatMensaje(chatmensaje: ChatMensaje, uid: number): ChatMessage {
    const seensRetrived: Seen[] = chatmensaje.seens.map(seen => {
        return generateSeensFromVistos(seen);
    });
    const newRetrived =
        !chatmensaje.seens.find(seen => seen.id_usuario === uid) && chatmensaje.id_usuario !== uid
            ? true
            : false;

    return {
        id: chatmensaje.id_chatmensaje,
        conversationId: chatmensaje.id_conversacion,
        userId: chatmensaje.id_usuario,
        message: chatmensaje.chatmensaje,
        date: Number(chatmensaje.fecha),
        replyMessage: chatmensaje.mensaje
            ? {
                  id: chatmensaje.mensaje.id_mensaje,
                  message: chatmensaje.mensaje.mensaje,
                  user: {
                      id: chatmensaje.mensaje.usuario.id_usuario,
                      nickname: chatmensaje.mensaje.usuario.alias,
                      universityId: chatmensaje.mensaje.usuario.id_universidad,
                  },
              }
            : undefined,
        reply: chatmensaje.reply
            ? {
                  id: chatmensaje.reply.chatmensaje.id_chatmensaje,
                  message: chatmensaje.reply.chatmensaje.chatmensaje,
                  user: {
                      id: chatmensaje.reply.chatmensaje.usuario.id_usuario,
                      nickname: chatmensaje.reply.chatmensaje.usuario.alias,
                      universityId: chatmensaje.reply.chatmensaje.usuario.id_universidad,
                  },
              }
            : undefined,
        seens: seensRetrived,
        newMsg: newRetrived,
    };
}

function generateSeensFromVistos(visto: Vistos): Seen {
    return {
        userId: visto.id_usuario,
        date: Number(visto.fecha),
    };
}

export { generateConversationFromConversacion, generateChatMsgFromChatMensaje };
