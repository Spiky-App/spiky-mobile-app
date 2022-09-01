import React, { useEffect, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { faLocationArrow } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Comment } from '../types/store';
import ButtonIcon from './common/ButtonIcon';

interface Form {
    comment: string;
}

interface Props {
    messageId: number;
    updateComments: (comment: Comment) => void;
}

const MAX_LENGHT = 180;

const DEFAULT_FORM: Form = {
    comment: '',
};

export const InputComment = ({ messageId, updateComments }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { createMessageComment } = useSpikyService();
    const [, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const { form, onChange } = useForm<Form>(DEFAULT_FORM);

    const { comment } = form;

    async function onPress() {
        setDisabled(true);
        const messageComment = await createMessageComment(messageId, uid, comment);
        if (messageComment) {
            updateComments(messageComment);
        }
        onChange(DEFAULT_FORM);
        Keyboard.dismiss();
        setDisabled(false);
    }

    useEffect(() => {
        const counterUpdated = MAX_LENGHT - comment.length;
        setCounter(counterUpdated);
        if (comment.length <= MAX_LENGHT && comment.length > 0) {
            if (isDisabled) {
                setDisabled(false);
            }
        } else {
            setDisabled(true);
        }
    }, [comment]);

    return (
        <View
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
                    style={styles.textinput}
                    placeholder="Contribuye la idea..."
                    multiline={true}
                    onChangeText={text => onChange({ comment: text })}
                    value={comment}
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
                onPress={onPress}
            />
        </View>
    );
};
