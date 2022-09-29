import { Notification as Notificacion } from '../types/services/spiky';
import { Notification } from '../types/store';

function generateNotificationsFromNotificacion(notificacion: Notificacion): Notification {
    return {
        id: notificacion.id_notificacion,
        messageId: notificacion.id_mensaje,
        message: notificacion.mensaje.mensaje,
        type: notificacion.tipo,
        seen: notificacion.visto,
        updatedAt: notificacion.updatedAt,
        createdAt: notificacion.createdAt,
        user: {
            nickname: notificacion.usuario2.alias,
            universityId: notificacion.usuario2.id_universidad,
        },
    };
}

export { generateNotificationsFromNotificacion };
