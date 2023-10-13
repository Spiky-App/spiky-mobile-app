import { Notification as Notificacion } from '../types/services/spiky';
import { Notification } from '../types/store';

function generateNotificationsFromNotificacion(notificacion: Notificacion): Notification {
    return {
        id: notificacion.id_notification,
        type: notificacion.type,
        seen: notificacion.seen,
        updatedAt: notificacion.updated_at,
        createdAt: notificacion.created_at,
        notificationIdea: notificacion.notification_idea
            ? {
                  user: notificacion.notification_idea?.comment?.anonymous
                      ? {
                            nickname: 'SuperAnónimo',
                            universityId: 0,
                            online: false,
                        }
                      : {
                            nickname: notificacion.notification_idea.usuario.alias,
                            universityId: notificacion.notification_idea.usuario.id_universidad,
                            online: notificacion.notification_idea.usuario.online,
                        },
                  idea: {
                      id: notificacion.notification_idea.id_idea,
                      message: notificacion.notification_idea.idea.mensaje,
                  },
                  comment: notificacion.notification_idea.comment
                      ? {
                            message: notificacion.notification_idea.comment?.respuesta,
                            anonymous: notificacion.notification_idea.comment?.anonymous,
                        }
                      : null,
              }
            : null,
        notificationPrompt: notificacion.notification_prompt
            ? {
                  title: notificacion.notification_prompt.title,
                  message: notificacion.notification_prompt.message,
                  notification_random_chat: notificacion.notification_prompt
                      .notification_random_chat
                      ? {
                            chat: {
                                id: notificacion.notification_prompt.notification_random_chat?.chat
                                    .id_conversacion,
                                user_1: {
                                    id: notificacion.notification_prompt.notification_random_chat
                                        .chat.usuario1.id_usuario,
                                    universityId:
                                        notificacion.notification_prompt.notification_random_chat
                                            .chat.usuario1.id_universidad,
                                    online: notificacion.notification_prompt
                                        .notification_random_chat.chat.usuario1.online,
                                    nickname: '',
                                },
                                user_2: {
                                    id: notificacion.notification_prompt.notification_random_chat
                                        .chat.usuario2.id_usuario,
                                    universityId:
                                        notificacion.notification_prompt.notification_random_chat
                                            .chat.usuario2.id_universidad,
                                    online: notificacion.notification_prompt
                                        .notification_random_chat.chat.usuario2.online,
                                    nickname: '',
                                },
                            },
                        }
                      : null,
              }
            : null,
    };
}

export { generateNotificationsFromNotificacion };
