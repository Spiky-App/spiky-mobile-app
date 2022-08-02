interface Universidad {
    alias: string;
}

interface Usuario {
    alias: string;
    // id_usuario: number;
    universidad: Universidad;
}

export interface NotificacionesInterface {
    id_notificacion: number;
    id_mensaje: number;
    tipo: number;
    visto: boolean;
    updatedAt: string | null;
    createdAt: string;
    usuario2: Usuario;
    mensaje: {
        mensaje: string;
    };
}

export const notificaciones: NotificacionesInterface[] = [
    {
        id_notificacion: 252,
        id_mensaje: 212,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-07-16T16:11:35.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: '@[@raul](1) ',
        },
    },
    {
        id_notificacion: 251,
        id_mensaje: 212,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-07-16T16:11:33.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: '@[@raul](1) ',
        },
    },
    {
        id_notificacion: 250,
        id_mensaje: 212,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-07-16T16:11:32.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: '@[@raul](1) ',
        },
    },
    {
        id_notificacion: 247,
        id_mensaje: 193,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-25T17:16:50.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa ',
        },
    },
    {
        id_notificacion: 246,
        id_mensaje: 191,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-25T17:15:55.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'aaaaaaaaaaaaaaaaa',
        },
    },
    {
        id_notificacion: 245,
        id_mensaje: 179,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-25T15:29:57.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf #[#UnHashTagMas](6)  aaaaaaa',
        },
    },
    {
        id_notificacion: 244,
        id_mensaje: 174,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-25T15:18:35.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdfasd @[@raaull](5) \n',
        },
    },
    {
        id_notificacion: 242,
        id_mensaje: 173,
        tipo: 4,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-25T15:18:04.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf @[@fer](2) ',
        },
    },
    {
        id_notificacion: 241,
        id_mensaje: 89,
        tipo: 2,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-17T01:52:09.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Tyyttttt',
        },
    },
    {
        id_notificacion: 240,
        id_mensaje: 77,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-16T23:00:40.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'p*t*',
        },
    },
    {
        id_notificacion: 236,
        id_mensaje: 89,
        tipo: 2,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-11T14:46:36.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Tyyttttt',
        },
    },
    {
        id_notificacion: 235,
        id_mensaje: 89,
        tipo: 2,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-11T14:43:25.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Tyyttttt',
        },
    },
    {
        id_notificacion: 234,
        id_mensaje: 82,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-11T00:02:09.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Holaaaa',
        },
    },
    {
        id_notificacion: 233,
        id_mensaje: 80,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-11T00:02:00.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'p*t* p*t*',
        },
    },
    {
        id_notificacion: 232,
        id_mensaje: 79,
        tipo: 2,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-11T00:01:57.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf dsf',
        },
    },
    {
        id_notificacion: 231,
        id_mensaje: 79,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-11T00:01:53.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf dsf',
        },
    },
    {
        id_notificacion: 230,
        id_mensaje: 81,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T22:57:57.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'adsfad P*t***',
        },
    },
    {
        id_notificacion: 229,
        id_mensaje: 89,
        tipo: 2,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T22:57:48.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Tyyttttt',
        },
    },
    {
        id_notificacion: 228,
        id_mensaje: 89,
        tipo: 2,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T22:57:46.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Tyyttttt',
        },
    },
    {
        id_notificacion: 227,
        id_mensaje: 89,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T22:57:37.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'Tyyttttt',
        },
    },
    {
        id_notificacion: 223,
        id_mensaje: 88,
        tipo: 1,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T22:44:41.000Z',
        usuario2: {
            alias: 'raull',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdfasdfasdfadfsdfasdfasdfasdfadfs',
        },
    },
    {
        id_notificacion: 222,
        id_mensaje: 86,
        tipo: 3,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T22:34:59.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf @[@fer](2)\n',
        },
    },
    {
        id_notificacion: 221,
        id_mensaje: 86,
        tipo: 3,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T20:19:45.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf @[@fer](2)\n',
        },
    },
    {
        id_notificacion: 220,
        id_mensaje: 86,
        tipo: 3,
        visto: false,
        updatedAt: null,
        createdAt: '2022-06-10T20:18:15.000Z',
        usuario2: {
            alias: 'raul',
            universidad: {
                alias: 'UP',
            },
        },
        mensaje: {
            mensaje: 'asdf @[@fer](2)\n',
        },
    },
];
