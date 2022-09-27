import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { MentionInput } from 'react-native-controlled-mentions';
import { MentionData } from 'react-native-controlled-mentions/dist/types';
import { faLocationArrow } from '../constants/icons/FontAwesome';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Comment } from '../types/store';
import ButtonIcon from './common/ButtonIcon';
import { renderSuggetions } from './Suggestions';

export interface FormComment {
    comment: string;
}

interface Props {
    messageId: number;
    updateComments: (comment: Comment) => void;
    form: FormComment;
    onChange: (stateUpdated: Partial<FormComment>) => void;
    refInputComment: React.RefObject<TextInput>;
}

const MAX_LENGHT = 180;

const DEFAULT_FORM: FormComment = {
    comment: '',
};

export const InputComment = ({
    messageId,
    updateComments,
    form,
    onChange,
    refInputComment,
}: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { createMessageComment } = useSpikyService();
    const [counter, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const [inputHeight, setInputHeight] = useState(0);
    const { comment } = form;
    async function onPress() {
        setDisabled(true);
        const messageComment = await createMessageComment(messageId, uid, comment);
        if (messageComment) {
            updateComments(messageComment);
        }
        onChange(DEFAULT_FORM);
        Keyboard.dismiss();
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
            onLayout={event => {
                const { height } = event.nativeEvent.layout;
                setInputHeight(height);
            }}
            style={{
                backgroundColor: '#E6E6E6',
                bottom: 6,
                left: 0,
                right: 0,
                paddingHorizontal: 10,
                paddingVertical: 13,
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderRadius: 8,
                width: '95%',
            }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    paddingHorizontal: 8,
                    justifyContent: 'center',
                    borderRadius: 8,
                    ...(counter < 0 && stylesInputComment.borderTextbox),
                }}
            >
                <MentionInput
                    inputRef={refInputComment}
                    placeholder="Perpetua tu idea.."
                    placeholderTextColor="#707070"
                    style={{ ...styles.textinput, fontSize: 16 }}
                    multiline={true}
                    value={comment}
                    onChange={text => onChange({ comment: text })}
                    partTypes={[
                        {
                            trigger: '@',
                            renderSuggestions: props =>
                                renderSuggetions({ ...props, isMention: true, inputHeight }),
                            textStyle: { ...styles.h5, color: '#5c71ad' },
                            allowedSpacesCount: 0,
                            isInsertSpaceAfterMention: true,
                            getPlainString: ({ name }: MentionData) => name,
                        },
                    ]}
                />
            </View>
            <View style={{ paddingLeft: 8 }}>
                <ButtonIcon
                    icon={faLocationArrow}
                    style={{
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        borderRadius: 100,
                        height: 36,
                        width: 36,
                    }}
                    iconStyle={{ transform: [{ rotate: '45deg' }] }}
                    disabled={isDisabled}
                    onPress={onPress}
                />
                {counter <= 40 && (
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '300',
                            color: counter < 0 ? '#FC702A' : '#9C9C9C',
                            textAlign: 'center',
                            margin: 'auto',
                            bottom: '-50%',
                        }}
                    >
                        {counter}
                    </Text>
                )}
            </View>
        </View>
    );
};

const stylesInputComment = StyleSheet.create({
    borderTextbox: {
        borderColor: '#FC702A',
        borderWidth: 0.2,
    },
});
