
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Axios, AxiosPrivate } from "./Axios";

interface ILoginData {
    correo: string;
    contrasena: string;
  }
  interface ILoginResponseData {
    ok: boolean;
    uid: number;
    alias: string;
    universidad: string;
    n_notificaciones: number;
    token: string
}

export const AuthLoginService = async (authData: ILoginData) => {
  console.log(authData);
  const { correo, contrasena } = authData;
  const response = await Axios().post<ILoginResponseData>("api/auth/login", { correo, contrasena });
  if (response.status === 200) {
    console.log('Succesfull response:', response.data);
    try {
      await AsyncStorage.setItem("token", JSON.stringify(response.data.token));
      await AsyncStorage.setItem("token-init-date", JSON.stringify(new Date().getTime()));
    } catch (error) {
      console.log(error);
    }
    console.log('Token:', await AsyncStorage.getItem("token"));
    return response.data;
  } else {
    Alert.alert("Error", "Usuario o contraseña incorrectos");
    return null;
  }
}

interface IRegisterData {
    validCorreo: string;
    contrasena: string;
    alias   : string;
};
export const register = (data: IRegisterData) => AxiosPrivate().post('api/auth/register', data);