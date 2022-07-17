interface Universidad {
  alias: string;
}

interface Usuario {
  alias: string;
  id_usuario: number;
  universidad: Universidad;
}

interface RespReacciones {
  tipo: number;
}

export interface ComentarioInterface {
  id_respuesta: number;
  id_usuario: number;
  id_mensaje: number;
  respuesta: string;
  resp_reaccion_1: number | null;
  resp_reaccion_2: number | null;
  resp_reacciones: RespReacciones[];
  fecha: string;
  usuario: Usuario;
}

export const comentarios: ComentarioInterface[] = [
  {
    id_respuesta: 230,
    respuesta: 'asdfasdfasdf',
    fecha: '1654463356800',
    id_mensaje: 88,
    id_usuario: 1,
    resp_reaccion_1: null,
    resp_reaccion_2: 1,
    usuario: {
      alias: 'raul',
      id_usuario: 1,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [],
  },
  {
    id_respuesta: 231,
    respuesta: 'asdfasdfasd',
    fecha: '1654463671006',
    id_mensaje: 88,
    id_usuario: 1,
    resp_reaccion_1: null,
    resp_reaccion_2: 1,
    usuario: {
      alias: 'raul',
      id_usuario: 1,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [],
  },
  {
    id_respuesta: 232,
    respuesta: 'asdfasdfasd',
    fecha: '1654463673489',
    id_mensaje: 88,
    id_usuario: 1,
    resp_reaccion_1: 1,
    resp_reaccion_2: null,
    usuario: {
      alias: 'raul',
      id_usuario: 1,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [],
  },
  {
    id_respuesta: 284,
    respuesta: 'asdfasdfsdfasdfasdfa sdfdf asdf asdf asd fadf sd fasdfsd fd sfs dfsdfsd',
    fecha: '1654557178308',
    id_mensaje: 88,
    id_usuario: 2,
    resp_reaccion_1: 3,
    resp_reaccion_2: null,
    usuario: {
      alias: 'fer',
      id_usuario: 2,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [
      {
        tipo: 1,
      },
      {
        tipo: 1,
      },
    ],
  },
  {
    id_respuesta: 285,
    respuesta: 'zdsfasd',
    fecha: '1654567605227',
    id_mensaje: 88,
    id_usuario: 2,
    resp_reaccion_1: 1,
    resp_reaccion_2: 1,
    usuario: {
      alias: 'fer',
      id_usuario: 2,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [
      {
        tipo: 1,
      },
    ],
  },
  {
    id_respuesta: 286,
    respuesta: ' Ghhhhjjjjj',
    fecha: '1654567908469',
    id_mensaje: 88,
    id_usuario: 2,
    resp_reaccion_1: 1,
    resp_reaccion_2: 1,
    usuario: {
      alias: 'fer',
      id_usuario: 2,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [
      {
        tipo: 2,
      },
    ],
  },
  {
    id_respuesta: 287,
    respuesta: 'Ghhhhgg',
    fecha: '1654567912920',
    id_mensaje: 88,
    id_usuario: 2,
    resp_reaccion_1: 2,
    resp_reaccion_2: null,
    usuario: {
      alias: 'fer',
      id_usuario: 2,
      universidad: {
        alias: 'UP',
      },
    },
    resp_reacciones: [
      {
        tipo: 1,
      },
    ],
  },
];
