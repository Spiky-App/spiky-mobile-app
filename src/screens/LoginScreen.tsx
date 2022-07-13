import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useDispatch } from "react-redux";
import { ArrowBack } from "../components/ArrowBack";
import { BackgroundPaper } from "../components/BackgroundPaper";
import { BigTitle } from "../components/BigTitle";
import { faEye, faEyeSlash } from "../constants/icons/FontAwesome";
import { useForm } from "../hooks/useForm";
import { startLogin } from "../store/actions/authActions";
import { styles } from "../themes/appTheme";

interface ILoginScreenProps {
  email: "";
  password: "";
}

export const LoginScreen = () => {
  const dispatch = useDispatch();
  const { form, onChange } = useForm({
    email: "",
    password: ""
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log(form);
    const some = dispatch(
       await startLogin({ correo: form.email, contrasena: form.password })
    );
    //console.log(some);
  };

  const navigation = useNavigation<any>();
  const [ passVisible, setPassVisible ] = useState(true);

  return (
    <BackgroundPaper>
      <ArrowBack />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <BigTitle texts={[ "Agente", "de cambio" ]} />

          <View style={{ ...styles.input, marginVertical: 25 }}>
            <TextInput
              placeholder="Correo o seudónimo"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(value) => onChange(value, "email")}
            />
          </View>

          <View style={{ ...styles.input }}>
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={passVisible}
              autoCorrect={false}
              onChangeText={(value) => onChange(value, "password")}
            />
            <TouchableOpacity
              style={stylescom.pwdEyes}
              onPress={() => setPassVisible(!passVisible)}>
              <FontAwesomeIcon
                icon={passVisible ? faEye : faEyeSlash}
                size={16}
                color="#d4d4d4"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate("ForgotPwdScreen")}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={handleLogin}
            style={{ ...styles.button, paddingHorizontal: 30 }}>
            <Text style={{ ...styles.text, ...styles.textb }}>
              Iniciar sesión
            </Text>
          </TouchableHighlight>

          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate("CheckEmail")}>
            <Text style={styles.link}>Solicitar cuenta</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};

const stylescom = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 20
  },
  pwdEyes: {
    position: "absolute",
    right: 0,
    top: 9,
    paddingRight: 7
  }
});
