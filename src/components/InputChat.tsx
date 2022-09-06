import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { faLocationArrow } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import ButtonIcon from './common/ButtonIcon';

export interface FormChat {
    message: string;
}

interface Props {
    form: FormChat;
    onChange: (stateUpdated: Partial<FormChat>) => void;
}

const MAX_LENGHT = 200;

// const DEFAULT_FORM: FormChat = {
//     message: '',
// };

export const InputChat = ({ form, onChange }: Props) => {
    const [, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const [inputHeight, setInputHeight] = useState(0);
    const { message } = form;

    useEffect(() => {
        const counterUpdated = MAX_LENGHT - message.length;
        setCounter(counterUpdated);
        if (message.length <= MAX_LENGHT && message.length > 0) {
            if (isDisabled) {
                setDisabled(false);
            }
        } else {
            setDisabled(true);
        }
    }, [message]);

    return (
        <View
            onLayout={event => {
                const { height } = event.nativeEvent.layout;
                setInputHeight(height);
            }}
            style={{
                backgroundColor: '#E6E6E6',
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
                    placeholder=""
                    placeholderTextColor="#707070"
                    style={{ ...styles.textinput, fontSize: 16 }}
                    multiline={true}
                    value={message}
                    onChange={text => onChange({ message: text })}
                />
            </View>
            <ButtonIcon
                icon={faLocationArrow}
                style={{
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    transform: [{ rotate: '45deg' }],
                    borderRadius: 100,
                }}
                disabled={isDisabled}
                // onPress={onPress}
            />
        </View>
    );
};
