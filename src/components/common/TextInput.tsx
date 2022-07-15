import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TextInputProps } from 'react-native';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { styles } from '../../themes/appTheme';
import { TouchableOpacityProps } from 'react-native';
import { HelperMessage, HelperMessageType } from '../../types/common';

interface Props extends TextInputProps {
  helperMessage?: HelperMessage;
  icon?: IconDefinition;
  touchableOpacityProps?: TouchableOpacityProps;
}

function TextInputCustom(props: Props) {
  const { helperMessage, icon, touchableOpacityProps } = props;
  const getTextStyle = () => {
    if (helperMessage?.type === HelperMessageType.WARNING) {
      return Styles.textError;
    }
    return Styles.text;
  };
  const getTextInputContainerStyle = () => {
    if (helperMessage?.type === HelperMessageType.WARNING) {
      return Styles.textInputContainerError;
    }
  };
  const textStyle = getTextStyle();
  const textInputContainerSyle = getTextInputContainerStyle();
  return (
    <View>
      <View style={{ ...Styles.textInputContainer, ...textInputContainerSyle }}>
        <TextInput
          {...props}
          placeholderTextColor="#707070"
          style={Styles.textInput}
        />
        {icon && (
          <TouchableOpacity {...touchableOpacityProps}>
            <FontAwesomeIcon icon={icon} size={27} color="#d4d4d4" />
          </TouchableOpacity>
        )}
      </View>
      {helperMessage && (
        <Text style={{ ...Styles.text, ...textStyle }}>{helperMessage.message}</Text>
      )}
    </View>
  );
}

export default TextInputCustom;

const Styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    width: 300,
    padding: 10,
  },
  textInput: {
    fontFamily: 'Helvetica',
    color: '#000000',
    fontSize: 14,
    padding: 0,
    flexGrow: 1,
  },
  text: {
    fontFamily: 'Helvetica',
    color: '#707070',
    fontSize: 11,
    fontWeight: '300',
  },
  textInputContainerError: {
    borderBottomColor: '#FF0000',
  },
  textError: {
    color: '#FF0000',
  },
});
