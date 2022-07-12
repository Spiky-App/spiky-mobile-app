export interface ILoginData {
    email: string;
    password: string;
  }

  export interface IRegisterData {
    validCorreo: string;
    contrasena: string;
    alias   : string;
    keyword: 'VC' 
};

export interface IUniversidad {
    alias: string;
  }
  
export interface IUsuario {
    alias: string;
    id_universidad: number;
    universidad: IUniversidad;
  }
  
export interface IIdea {
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