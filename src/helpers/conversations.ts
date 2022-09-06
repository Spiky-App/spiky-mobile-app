import { Conversation as Conversacion, ChatMessage as ChatMensaje } from '../types/services/spiky';
import { Conversation, ChatMessage } from '../types/store';

function generateConversationFromConversacion(conversacion: Conversacion): Conversation {
    const chatsMsgRetrived: ChatMessage[] | undefined = conversacion.chatmensajes?.map(chatmsg => {
        return generateChatMsgFromChatMensaje(chatmsg);
    });

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
            id: conversacion.usuario1.id_usuario,
            nickname: conversacion.usuario1.alias,
            university: {
                shortname: conversacion.usuario1.universidad.alias,
            },
            online: conversacion.usuario1.online,
        },
        chatmessages: chatsMsgRetrived ?? [],
    };
}

function generateChatMsgFromChatMensaje(chatmensaje: ChatMensaje): ChatMessage {
    return {
        id: chatmensaje.id_chatmensaje,
        conversationId: chatmensaje.id_conversacion,
        userId: chatmensaje.id_usuario,
        message: chatmensaje.chatmensaje,
        date: Number(chatmensaje.fecha),
        messageId: chatmensaje.id_mensaje,
        seens: Number(chatmensaje.seen?.[0]),
    };
}
export { generateConversationFromConversacion };
