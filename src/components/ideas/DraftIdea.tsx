import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { getTime } from '../../helpers/getTime';
import { styles } from '../../themes/appTheme';
import { Message, User } from '../../types/store';
import UniversityTag from '../common/UniversityTag';
import MsgTransform from '../MsgTransform';
import { faPen, faTrash } from '../../constants/icons/FontAwesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigator/Navigator';

interface Props {
    idea: Message;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
    handleDelete?: (id: number) => Promise<void>;
}

export const DraftIdea = ({
    idea,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleDelete,
}: Props) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const fecha = getTime(idea.date.toString());
    return (
        <>
            <View style={styles.corner_container}>
                <View style={styles.corner}>
                    <View style={{ transform: [{ rotate: '-45deg' }] }}>
                        <FontAwesomeIcon icon={faPen} color="white" size={13} />
                    </View>
                </View>
            </View>

            <Pressable
                onPress={() => handleClickUser(idea.user)}
                style={{ alignSelf: 'flex-start' }}
            >
                <View style={styles.button_user}>
                    <Text style={styles.user}>@{idea.user.nickname}</Text>
                    <UniversityTag id={idea.user.universityId} fontSize={14} />
                </View>
            </Pressable>

            <View style={{ paddingVertical: 14 }}>
                <MsgTransform
                    textStyle={styles.idea_msg}
                    text={idea.message}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                />
            </View>
            <View
                style={{
                    ...styles.flex_container,
                    justifyContent: 'space-between',
                }}
            >
                <Pressable
                    style={styles.button_container}
                    onPress={handleDelete ? () => handleDelete(idea.id) : undefined}
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        color="#67737D"
                        size={14}
                        style={{
                            shadowOffset: {
                                width: 1.5,
                                height: 2,
                            },
                        }}
                    />
                </Pressable>
                <View style={styles.flex_container}>
                    <Pressable
                        style={stylescom.publishDraft}
                        onPress={() =>
                            navigation.navigate('CreateIdeaScreen', {
                                draftedIdea: idea.message,
                                draftID: idea.id,
                            })
                        }
                    >
                        <View style={styles.button_container}>
                            <Text style={stylescom.publish}>{'editar / publicar'}</Text>
                        </View>
                    </Pressable>
                    <Text style={styles.number}>{fecha}</Text>
                </View>
            </View>
        </>
    );
};

const stylescom = StyleSheet.create({
    publishDraft: {
        flexDirection: 'row',
        marginLeft: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    publish: {
        ...styles.textbold,
        fontSize: 12,
        color: '#67737D',
        marginLeft: 1,
    },
});
