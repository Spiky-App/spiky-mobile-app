import React, { useEffect, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
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
    const [, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const [inputHeight, setInputHeight] = useState(0);
    // const refInputComment = useRef<TextInput>();
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
                            // isBottomMentionSuggestionsRender: true,
                            getPlainString: ({ name }: MentionData) => name,
                        },
                    ]}
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
