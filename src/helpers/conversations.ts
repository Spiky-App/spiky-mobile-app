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
        conversacion.chatmensajes[0],
        uid
    );

    return {
        id: conversacion.id_conversacion,
        user_1: {
            id: conversacion.usuario1.id_usuario,
            nickname: conversacion.usuario1.alias,
            university: {
                shortname: conversacion.usuario1.universidad.alias,
            },
            online: conversacion.usuario1.online,
        },
        user_2: {
            id: conversacion.usuario2.id_usuario,
            nickname: conversacion.usuario2.alias,
            university: {
                shortname: conversacion.usuario2.universidad.alias,
            },
            online: conversacion.usuario2.online,
        },
        chatmessage: chatsMsgRetrived,
    };
}

function generateChatMsgFromChatMensaje(chatmensaje: ChatMensaje, uid: number): ChatMessage {
    const seensRetrived: Seen[] | undefined = chatmensaje.seens?.map(seen => {
        return generateSeensFromVistos(seen);
    });
    const newRetrived =
        !chatmensaje.seens?.find(seen => seen.id_usuario % 2 === uid) &&
        chatmensaje.id_usuario !== uid
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
                      university: {
                          shortname: chatmensaje.mensaje.usuario.universidad.alias,
                      },
                  },
              }
            : undefined,
        seens: seensRetrived,
        new: newRetrived,
    };
}

function generateSeensFromVistos(visto: Vistos): Seen {
    return {
        userId: visto.id_usuario,
        date: Number(visto.fecha),
    };
}

export { generateConversationFromConversacion, generateChatMsgFromChatMensaje };
