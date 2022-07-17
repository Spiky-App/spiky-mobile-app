import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { faLocationArrow } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';

export const InputComment = () => {
  const [counter, setCounter] = useState(0);
  const [buttonState, setButtonState] = useState(true);
  const { form, onChange } = useForm({
    respuestaInput: '',
  });

  const { respuestaInput } = form;

  useEffect(() => {
    const max_length = 180;
    setCounter(max_length - respuestaInput.length);
    // changeCircleBorder('circleAR', max_length, respuestaInput.length);
    if (respuestaInput.length <= max_length && respuestaInput.length > 0) {
      if (buttonState) {
        setButtonState(false);
      }
    } else {
      setButtonState(true);
    }
  }, [respuestaInput]);

  return (
    <View
      style={{
        backgroundColor: '#E6E6E6',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 15,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
        }}
      >
        <TextInput
          style={styles.textinput}
          placeholder="Contribuye la idea..."
          multiline={true}
          onChange={value => onChange(value, 'respuestaInput')}
        />
      </View>

      <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          justifyContent: 'center',
          transform: [{ rotate: '45deg' }],
          borderRadius: 100,
        }}
        onPress={() => {}}
      >
        <FontAwesomeIcon icon={faLocationArrow} size={16} color={true ? '#d4d4d4d3' : '#01192E'} />
      </TouchableOpacity>
    </View>
  );
};
