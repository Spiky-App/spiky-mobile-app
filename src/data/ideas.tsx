interface Universidad {
    alias: string;
}

interface Usuario {
    alias: string;
    id_universidad: number;
    universidad: Universidad;
}

export interface IdeaInterface {
    id_usuario: number;
    id_mensaje: number;
    mensaje: string;
    fecha: string;
    contra: number;
    favor: number;
    reacciones: any[];
    trackings: any[];
    num_respuestas: number;
    usuario: Usuario;
    draft: number;
}

export const ideas: IdeaInterface[] = [
    {
        id_usuario: 1,
        id_mensaje: 1,
        mensaje: 'Hola a todos',
        fecha: '1650930143162',
        contra: 1,
        favor: 5,
        reacciones: [],
        trackings: [],
        num_respuestas: 10,
        usuario: {
            alias: 'raul',
            id_universidad: 1,
            universidad: {
                alias: 'UP',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 2,
        id_mensaje: 2,
        mensaje: 'Falta poco para la app',
        fecha: '1650930143162',
        contra: 1,
        favor: 5,
        reacciones: [
            {
                tipo: 1,
            },
        ],
        trackings: [],
        num_respuestas: 10,
        usuario: {
            alias: 'fer',
            id_universidad: 2,
            universidad: {
                alias: 'ITESO',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 3,
        id_mensaje: 4,
        mensaje: 'Hola como estas!!! @[@fer](2) Ya casiii #[#UnHashTagMas](6) jajajaja',
        fecha: '1650930143162',
        contra: 2,
        favor: 12,
        reacciones: [
            {
                tipo: 2,
            },
        ],
        trackings: [],
        num_respuestas: 5,
        usuario: {
            alias: 'alvaro',
            id_universidad: 3,
            universidad: {
                alias: 'TEC',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 3,
        id_mensaje: 11,
        mensaje: 'Hola mundo',
        fecha: '1650930143162',
        contra: 2,
        favor: 12,
        reacciones: [
            {
                tipo: 2,
            },
        ],
        trackings: [
            {
                id_tracking: 4,
            },
        ],
        num_respuestas: 5,
        usuario: {
            alias: 'alvaro',
            id_universidad: 3,
            universidad: {
                alias: 'TEC',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 3,
        id_mensaje: 5,
        mensaje: 'Que ondaaaaa???',
        fecha: '1650930143162',
        contra: 2,
        favor: 12,
        reacciones: [],
        trackings: [
            {
                id_tracking: 4,
            },
        ],
        num_respuestas: 5,
        usuario: {
            alias: 'alvaro',
            id_universidad: 3,
            universidad: {
                alias: 'TEC',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 1,
        id_mensaje: 6,
        mensaje: 'Hola a todos',
        fecha: '1650930143162',
        contra: 1,
        favor: 5,
        reacciones: [],
        trackings: [],
        num_respuestas: 10,
        usuario: {
            alias: 'raul',
            id_universidad: 1,
            universidad: {
                alias: 'UP',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 2,
        id_mensaje: 7,
        mensaje: 'Falta poco para la app',
        fecha: '1650930143162',
        contra: 1,
        favor: 5,
        reacciones: [
            {
                tipo: 1,
            },
        ],
        trackings: [],
        num_respuestas: 10,
        usuario: {
            alias: 'fer',
            id_universidad: 2,
            universidad: {
                alias: 'ITESO',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 3,
        id_mensaje: 8,
        mensaje: 'Hola mundo',
        fecha: '1650930143162',
        contra: 2,
        favor: 12,
        reacciones: [
            {
                tipo: 2,
            },
        ],
        trackings: [],
        num_respuestas: 5,
        usuario: {
            alias: 'alvaro',
            id_universidad: 3,
            universidad: {
                alias: 'TEC',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 3,
        id_mensaje: 9,
        mensaje: 'Hola mundo',
        fecha: '1650930143162',
        contra: 2,
        favor: 12,
        reacciones: [
            {
                tipo: 2,
            },
        ],
        trackings: [
            {
                id_tracking: 4,
            },
        ],
        num_respuestas: 5,
        usuario: {
            alias: 'alvaro',
            id_universidad: 3,
            universidad: {
                alias: 'TEC',
            },
        },
        draft: 0,
    },
    {
        id_usuario: 3,
        id_mensaje: 10,
        mensaje: 'Que ondaaaaa???',
        fecha: '1650930143162',
        contra: 2,
        favor: 12,
        reacciones: [],
        trackings: [
            {
                id_tracking: 4,
            },
        ],
        num_respuestas: 5,
        usuario: {
            alias: 'alvaro',
            id_universidad: 3,
            universidad: {
                alias: 'TEC',
            },
        },
        draft: 0,
    },
];
