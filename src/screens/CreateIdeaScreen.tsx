import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationArrow, faPenToSquare } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';

export const CreateIdeaScreen = () => {
  const [counter, setCounter] = useState(0);
  const [buttonState, setButtonState] = useState(true);
  const navigation = useNavigation();
  const { form, onChange } = useForm({
    mensaje: '',
  });

  const { mensaje } = form;

  useEffect(() => {
    setCounter(220 - mensaje.length);
    if (mensaje.length <= 220 && mensaje.length > 0) {
      if (buttonState) {
        setButtonState(false);
      }
    } else {
      setButtonState(true);
    }
  }, [mensaje]);

  return (
    <SafeAreaView style={stylecom.container}>
      <KeyboardAvoidingView behavior="height" style={stylecom.container}>
        <View style={{ height: '40%' }}>
          <TextInput
            placeholder="Perpetua tu idea.."
            placeholderTextColor="#707070"
            style={{ ...styles.textinput, fontSize: 16, fontWeight: '300' }}
            multiline={true}
            onChangeText={value => onChange( {mensaje: value})}
            autoFocus
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 70 : 50,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ ...styles.text, ...styles.link }}>Cancelar</Text>
          </TouchableOpacity>

          <View style={stylecom.WrapperMaxCounterNIdea}>
            <View style={stylecom.ConteMaxCounterNIdea}>
              <View style={stylecom.MaxCounterNIdea}></View>
              {counter <= 40 && (
                <Text
                  style={
                    counter < 0 ? stylecom.MaxCounterTextNIdeaRed : stylecom.MaxCounterTextNIdea
                  }
                >
                  {counter}
                </Text>
              )}
              <View
                style={{
                  ...(counter < 0
                    ? stylecom.MaxCounterNIdeaColorRed
                    : stylecom.MaxCounterNIdeaColor),
                  width: ((mensaje.length < 220 ? mensaje.length : 220) / 220) * 100 + `%`,
                }}
              ></View>
            </View>
          </View>

          <TouchableOpacity
            style={{ ...stylecom.circleButton, borderColor: buttonState ? '#d4d4d4d3' : '#01192E' }}
            onPress={() => {}}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              size={16}
              color={buttonState ? '#d4d4d4d3' : '#01192E'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...stylecom.circleButton, borderColor: buttonState ? '#d4d4d4d3' : '#01192E' }}
            onPress={() => {}}
          >
            <View
              style={{
                transform: [{ rotate: '45deg' }],
              }}
            >
              <FontAwesomeIcon
                icon={faLocationArrow}
                size={16}
                color={buttonState ? '#d4d4d4d3' : '#01192E'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const stylecom = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 20,
  },
  circleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 30,
  },
  WrapperMaxCounterNIdea: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ConteMaxCounterNIdea: {
    zIndex: 3,
    width: 100,
    margin: 'auto',
    // backgroundColor: 'green'
  },
  MaxCounterNIdea: {
    backgroundColor: '#d4d4d4d3',
    width: 100,
    height: 3,
    borderRadius: 5,
  },
  MaxCounterTextNIdea: {
    position: 'absolute',
    top: 0,
    fontSize: 14,
    fontWeight: '300',
    color: '#9C9C9C',
    paddingTop: 6,
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
  },
  MaxCounterTextNIdeaRed: {
    position: 'absolute',
    top: 0,
    fontSize: 14,
    fontWeight: '300',
    color: '#9b0000',
    paddingTop: 6,
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
  },
  MaxCounterNIdeaColor: {
    position: 'absolute',
    top: 0,
    zIndex: 3,
    width: 60,
    height: 3,
    borderRadius: 5,
    backgroundColor: '#01192E',
  },
  MaxCounterNIdeaColorRed: {
    position: 'absolute',
    top: 0,
    zIndex: 3,
    width: 60,
    height: 3,
    borderRadius: 5,
    backgroundColor: '#9b0000',
  },
});
