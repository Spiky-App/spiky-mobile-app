import React, { useEffect, useRef, useState } from 'react';
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
import ButtonIcon from './common/ButtonIcon';
import { faXmark } from '../constants/icons/FontAwesome';

interface Props {
    setModalTopics: (value: boolean) => void;
    modalTopics: boolean;
}

export const ModalTopics = ({ setModalTopics, modalTopics }: Props) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const topics = useAppSelector((state: RootState) => state.ui.topics);
    const [isExtended, setIsExtended] = useState(false);
    const height = useRef(new Animated.Value(390)).current;
    const inputRange = [0, 100];
    const outputRange = [0, 100];
    const heightAnimated = height.interpolate({ inputRange, outputRange });
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });

    function handleCloseModal(callback?: () => void) {
        movingPosition(0, 950, 400, () => {
            setModalTopics(false);
            isExtended && setIsExtended(false);
            callback && callback();
            height.setValue(390);
        });
    }

    function handleOpenCreateTopicIdeaScreen(topic: Topic) {
        handleCloseModal(() => navigation.navigate('CreateTopicIdeaScreen', { topic }));
    }

    function handleExtendModal() {
        setIsExtended(true);
        Animated.sequence([
            Animated.timing(height, {
                toValue: 700,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    }

    useEffect(() => {
        if (modalTopics) {
            movingPosition(950, 0, 700);
        }
    }, [modalTopics]);

    return (
        <Modal animationType="fade" visible={modalTopics} transparent={true}>
            <TouchableWithoutFeedback onPressOut={() => handleCloseModal(undefined)}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            <Animated.View
                                style={[stylescom.subcontainer, { height: heightAnimated }]}
                            >
                                <View style={[styles.flex_spc_between, { marginBottom: 12 }]}>
                                    <Text style={[styles.text_button, { fontSize: 16 }]}>
                                        Elige una categoría:
                                    </Text>
                                    <ButtonIcon
                                        icon={faXmark}
                                        onPress={() => handleCloseModal(undefined)}
                                        style={{
                                            height: 24,
                                            width: 24,
                                            backgroundColor: '#D4D4D4',
                                        }}
                                    />
                                </View>
                                {topics ? (
                                    <FlatList
                                        data={isExtended ? topics : topics.slice(0, 4)}
                                        numColumns={2}
                                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                style={[
                                                    stylescom.topic_container,
                                                    { backgroundColor: item.backgroundColor },
                                                ]}
                                                onPress={() =>
                                                    handleOpenCreateTopicIdeaScreen(item)
                                                }
                                            >
                                                <View style={stylescom.emoji_container}>
                                                    <Text style={styles.h4}>{item.emoji}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.h6}>{item.name}.</Text>
                                                </View>
                                            </Pressable>
                                        )}
                                        keyExtractor={item => item.id + ''}
                                        scrollEnabled={isExtended}
                                    />
                                ) : (
                                    <View style={[styles.flex_center, { flex: 1 }]}>
                                        <Text style={[styles.textGray, { fontSize: 14 }]}>
                                            No hay discuciones disponibles.
                                        </Text>
                                    </View>
                                )}
                                {topics && !isExtended && topics?.length > 4 && (
                                    <View style={styles.flex_center}>
                                        <Pressable
                                            style={stylescom.button_container}
                                            onPress={handleExtendModal}
                                        >
                                            <Text style={styles.text_button}>Mostrar mas</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        // height: 390,
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
        justifyContent: 'center',
    },
    subcontainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        height: '45%',
    },
    topic_container: {
        backgroundColor: '#D9E9E3',
        borderRadius: 14,
        height: 140,
        width: '47%',
        padding: 20,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    emoji_container: {
        ...styles.flex_center,
        backgroundColor: '#ffff',
        borderRadius: 15,
        height: 40,
        width: 40,
        marginBottom: 15,
    },
    button_container: {
        ...styles.button_container,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginVertical: 10,
    },
});
