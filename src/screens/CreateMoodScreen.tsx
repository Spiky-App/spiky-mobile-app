import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    Animated,
    Pressable,
    FlatList,
} from 'react-native';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { BackgroundPaper } from '../components/BackgroundPaper';
import ButtonIcon from '../components/common/ButtonIcon';
import {
    faLocationArrow,
    faFaceSmile,
    faFlagCheckered,
    faChevronLeft,
} from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import useSpikyService from '../hooks/useSpikyService';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import EmojisKeyboard from '../components/EmojisKeyboard';
import { generateMessageFromMensaje } from '../helpers/message';
import { Message } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addMessage } from '../store/feature/messages/messagesSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useAnimation } from '../hooks/useAnimation';
import NetworkErrorFeed from '../components/NetworkErrorFeed';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { Mood } from '../types/store';
import { generateMoodFromEstado } from '../helpers/mood';

type NavigationDrawerProp = DrawerNavigationProp<DrawerParamList>;
interface Form {
    mood: string;
    emoji: string;
}

export const CreateMoodScreen = () => {
    const QUESTION_MAX_LENGHT = 220;
    const user = useAppSelector((state: RootState) => state.user);
    const navDrawer = useNavigation<NavigationDrawerProp>();
    const { updateMood, getMoodHistory } = useSpikyService();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [moods, setMoods] = useState<Mood[]>([]);
    const [emojiKerboard, setEmojiKerboard] = useState(false);
    const { fadeIn, opacity } = useAnimation({});
    const { form, onChange } = useForm<Form>({
        mood: '',
        emoji: '',
    });
    const { mood, emoji } = form;

    function handleChangeEmoji(emojiSelection: string) {
        onChange({ emoji: emojiSelection });
    }

    function invalid() {
        if (mood === '' || emoji === '') {
            return true;
        }
        return false;
    }

    async function handleUpdateMood() {
        setIsLoading(true);
        const mensaje = await updateMood(emoji, mood);
        if (mensaje) {
            const createdMessage: Message = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: user.nickname,
                    id_universidad: user.universityId,
                },
                reacciones: [],
                encuesta_opciones: [],
            });
            dispatch(addMessage(createdMessage));
            dispatch(
                setModalAlert({
                    isOpen: true,
                    text: 'Estado publicado.',
                    icon: faFlagCheckered,
                })
            );
            navDrawer.navigate('CommunityScreen');
        }
        setIsLoading(false);
    }

    async function loadMoodHistory() {
        const { data, networkError: networkErrorReturn } = await getMoodHistory();
        if (networkErrorReturn) setNetworkError(true);
        const reactionList = data.map(a => generateMoodFromEstado(a));
        setMoods(reactionList);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        loadMoodHistory();
        return () => setMoods([]);
    }, []);

    useEffect(() => {
        fadeIn();
    }, [moods]);

    return (
        <>
            <BackgroundPaper>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={stylecom.container}
                    >
                        <View style={{ marginVertical: 10 }}>
                            <View style={stylecom.back_arrow}>
                                <Pressable
                                    onPress={() => navDrawer.goBack()}
                                    style={{ paddingRight: 6 }}
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        color={'#01192E'}
                                        size={22}
                                    />
                                </Pressable>
                                <Text style={styles.h3}>
                                    Crear estado<Text style={styles.orange}>.</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={stylecom.input}>
                            <Pressable
                                style={[styles.center, { marginHorizontal: 10 }]}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    setEmojiKerboard(true);
                                }}
                            >
                                {emoji === '' ? (
                                    <FontAwesomeIcon
                                        icon={faFaceSmile}
                                        color={'#67737D'}
                                        size={35}
                                    />
                                ) : (
                                    <Text style={{ fontSize: 38 }}>{emoji}</Text>
                                )}
                            </Pressable>
                            <TextInput
                                placeholder="¿Cómo te sientes hoy?"
                                placeholderTextColor="#707070"
                                autoFocus
                                multiline={true}
                                style={{
                                    ...styles.textinput,
                                    flexDirection: 'row',
                                    flexShrink: 1,
                                    fontSize: 16,
                                    flexGrow: 1,
                                }}
                                value={mood}
                                onChangeText={value => {
                                    if (value.length < QUESTION_MAX_LENGHT)
                                        onChange({ mood: value });
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <ButtonIcon
                                disabled={isLoading || invalid()}
                                icon={faLocationArrow}
                                onPress={handleUpdateMood}
                                style={{ marginRight: 2 }}
                                iconStyle={{ transform: [{ rotate: '45deg' }] }}
                            />
                        </View>
                        <Text style={styles.h4}>Historial:</Text>
                        {!isLoading && !networkError && moods.length > 0 && (
                            <Animated.View style={{ ...stylecom.hist_container, opacity }}>
                                <FlatList
                                    data={moods}
                                    renderItem={({ item, index }) => (
                                        <MoodRecord
                                            mood={item.mood}
                                            emoji={item.emoji}
                                            date={item.date}
                                            total={moods.length}
                                            index={index}
                                        />
                                    )}
                                    keyExtractor={item => item.id + ''}
                                    showsVerticalScrollIndicator={true}
                                />
                            </Animated.View>
                        )}

                        {networkError && <NetworkErrorFeed callback={loadMoodHistory} />}

                        {isLoading && moods.length === 0 && (
                            <Animated.View
                                style={{
                                    ...stylecom.hist_container,
                                    ...styles.center,
                                    opacity,
                                }}
                            >
                                <LoadingAnimated />
                            </Animated.View>
                        )}
                        {!isLoading && moods.length === 0 && (
                            <Animated.View style={{ ...stylecom.hist_container, opacity }}>
                                <MoodRecord
                                    mood="Pensando un estado..."
                                    emoji="🤔"
                                    date="Sin estado"
                                    index={0}
                                    total={1}
                                />
                            </Animated.View>
                        )}
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </BackgroundPaper>
            <EmojisKeyboard
                isOpend={emojiKerboard}
                setEmojiKerboard={setEmojiKerboard}
                afterSelection={handleChangeEmoji}
            />
        </>
    );
};

interface MoodRecordProp {
    mood: string;
    emoji: string;
    date: string;
    total: number;
    index: number;
}

const MoodRecord = ({ mood, emoji, date, index, total }: MoodRecordProp) => (
    <View style={[styles.flex_center, { justifyContent: 'flex-start' }]}>
        <View style={styles.center}>
            <View
                style={[
                    stylecom.line_top,
                    { backgroundColor: index === 0 ? 'transparent' : '#D4D4D4' },
                ]}
            />
            <Text style={{ fontSize: 50 }}>{emoji}</Text>
            <View
                style={[
                    stylecom.line_bottom,
                    { backgroundColor: index === total - 1 ? 'transparent' : '#D4D4D4' },
                ]}
            />
        </View>
        <View style={stylecom.text_container}>
            <View style={stylecom.date_container}>
                <Text style={styles.text_button}>{date}</Text>
            </View>
            <Text style={styles.msg}>{mood}</Text>
        </View>
    </View>
);

const stylecom = StyleSheet.create({
    container: {
        width: '92%',
        marginTop: 15,
        marginHorizontal: 20,
        justifyContent: 'flex-start',
        flex: 1,
    },
    input: {
        ...styles.input,
        ...styles.center,
        paddingLeft: 0,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 15,
        minHeight: 65,
    },
    emoji_container: {
        ...styles.center,
        minHeight: 80,
        minWidth: 80,
        borderRadius: 10,
    },
    plusIcon: {
        position: 'absolute',
        top: -9,
        right: -8,
    },
    text_container: {
        marginVertical: 28,
        paddingHorizontal: 15,
        flexShrink: 1,
        alignSelf: 'center',
        textAlign: 'flex-start',
    },
    date_container: {
        marginBottom: 12,
        backgroundColor: '#E8E8E8',
        borderRadius: 3,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
    },
    hist_container: {
        ...styles.white_wrap,
        marginTop: 8,
        paddingHorizontal: 26,
        paddingBottom: 6,
        flexGrow: 1,
    },
    line_top: {
        flex: 1,
        width: 4,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
    },
    line_bottom: {
        flex: 1,
        width: 4,
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6,
    },
    back_arrow: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
    },
});
