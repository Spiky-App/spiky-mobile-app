import React, { useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Animated,
    Text,
    FlatList,
    Pressable,
} from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { RootStackParamList } from '../navigator/Navigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Topic } from '../types/store';

interface Props {
    setModalTopics: (value: boolean) => void;
    modalTopics: boolean;
}

export const ModalTopics = ({ setModalTopics, modalTopics }: Props) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const topics = useAppSelector((state: RootState) => state.ui.topics);
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });

    function handleCloseModal() {
        movingPosition(0, 950, 400, () => setModalTopics(false));
    }

    function handleOpenCreateTopicIdeaScreen(topic: Topic) {
        handleCloseModal();
        navigation.navigate('CreateTopicIdeaScreen', { topic });
    }

    useEffect(() => {
        if (modalTopics) {
            movingPosition(950, 0, 700);
        }
    }, [modalTopics]);

    return (
        <Modal animationType="fade" visible={modalTopics} transparent={true}>
            <TouchableWithoutFeedback onPressOut={handleCloseModal}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            <Text style={[styles.h4, { paddingBottom: 10 }]}>
                                Hablemos de
                                <Text style={styles.orange}>...</Text>
                            </Text>
                            {topics ? (
                                <FlatList
                                    data={topics}
                                    numColumns={2}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            style={[
                                                stylescom.topic_container,
                                                { backgroundColor: item.backgroundColor },
                                            ]}
                                            onPress={() => handleOpenCreateTopicIdeaScreen(item)}
                                        >
                                            <View style={stylescom.emoji_container}>
                                                <Text style={styles.h4}>{item.emoji}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.h4}>{item.name}.</Text>
                                            </View>
                                        </Pressable>
                                    )}
                                    keyExtractor={item => item.id + ''}
                                />
                            ) : (
                                <View style={[styles.flex_center, { flex: 1 }]}>
                                    <Text style={[styles.textGray, { fontSize: 14 }]}>
                                        No hay discuciones disponibles.
                                    </Text>
                                </View>
                            )}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: 390,
        width: '100%',
        backgroundColor: '#ffff',
        paddingHorizontal: 25,
        paddingVertical: 20,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingBottom: 30,
    },
    topic_container: {
        backgroundColor: '#D9E9E3',
        borderRadius: 14,
        height: 140,
        width: '47%',
        padding: 25,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        marginBottom: 22,
    },
    emoji_container: {
        ...styles.flex_center,
        backgroundColor: '#ffff',
        borderRadius: 15,
        height: 40,
        width: 40,
        marginBottom: 15,
    },
});
