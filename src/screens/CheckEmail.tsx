import React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { BigTitle } from '../components/BigTitle';
import { useNavigation } from '@react-navigation/native';

export const CheckEmail = () => {
  //Borrar este hook
  const navigation = useNavigation<any>();

  // const { form, onChange } = useForm({
  const { onChange } = useForm({
    email: '',
  });

  return (
    <BackgroundPaper>
      <ArrowBack />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <BigTitle texts={['Sé parte', 'del cambio']} />

          <View style={{ ...styles.input, marginVertical: 25 }}>
            <TextInput
              placeholder="Correo universitario"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={value => onChange(value, 'email')}
            />
          </View>

          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={() => {}}
            style={{ ...styles.button, paddingHorizontal: 30 }}
          >
            <Text style={{ ...styles.text, ...styles.textb }}>Verificar correo</Text>
          </TouchableHighlight>

          {/* Borrar este boton, solo para acceder a este screen */}
          <Button title="Register Screen" onPress={() => navigation.navigate('RegisterScreen')} />
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};
