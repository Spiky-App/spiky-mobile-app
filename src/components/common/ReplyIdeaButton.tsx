import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, TouchableOpacityProps } from 'react-native';
import { faReply } from '../../constants/icons/FontAwesome';
import { styles } from '../../themes/appTheme';
import { Idea } from '../../types/store';
import { RootStackParamList } from '../../navigator/Navigator';

interface Props extends TouchableOpacityProps {
    isOwner: boolean;
    idea: Idea;
    openReplyIdeaScreen: (param: RootStackParamList['ReplyIdeaScreen']) => void;
    isOpenedIdeaScreen: boolean;
}

export function ReplyIdeaButton({ isOwner, idea, openReplyIdeaScreen, isOpenedIdeaScreen }: Props) {
    if (!isOwner && !idea.anonymous && !isOpenedIdeaScreen) {
        return (
            <Pressable
                style={styles.button_container}
                onPress={() =>
                    openReplyIdeaScreen({
                        idea: {
                            id: idea.id,
                            message: idea.message,
                            user: idea.user,
                            date: idea.date,
                            type: idea.type,
                        },
                    })
                }
            >
                <FontAwesomeIcon icon={faReply} color={'#67737D'} size={12} />
            </Pressable>
        );
    } else {
        return <></>;
    }
}
