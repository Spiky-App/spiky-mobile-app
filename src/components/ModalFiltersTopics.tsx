import React from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { CheckBox } from './CheckBox';
import { Topic } from '../types/store';

interface Props {
    setIsModalOpen: (value: boolean) => void;
    topicSelected: Topic | undefined;
    setTopicSelected: (topic: Topic | undefined) => void;
    isModalOpen: boolean;
}

export const ModalFiltersTopics = ({
    isModalOpen,
    setIsModalOpen,
    setTopicSelected,
    topicSelected,
}: Props) => {
    const topics = useAppSelector((state: RootState) => state.ui.topics);

    function handleChangeTopic(item: Topic | undefined) {
        setTopicSelected(item);
        setIsModalOpen(false);
    }

    return (
        <Modal animationType="fade" visible={isModalOpen} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setIsModalOpen(false)}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <View style={stylescomp.container}>
                            <View style={{ ...styles.flex, justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.text, ...styles.h3 }}>
                                    Tópicos
                                    <Text style={styles.orange}>.</Text>
                                </Text>
                            </View>

                            <Text style={{ ...styles.text, ...styles.textGray, marginTop: 10 }}>
                                Hablemos de:
                            </Text>

                            <View style={{ marginLeft: 20, marginTop: 15 }}>
                                <TouchableOpacity
                                    style={{ ...styles.flex, paddingBottom: 15 }}
                                    onPress={() => handleChangeTopic(undefined)}
                                >
                                    <CheckBox checked={topicSelected === undefined} />
                                    <Text style={{ ...styles.h7, fontSize: 13, marginLeft: 6 }}>
                                        Todos.
                                    </Text>
                                </TouchableOpacity>

                                <FlatList
                                    data={topics}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ ...styles.flex_start, marginBottom: 10 }}
                                            onPress={() => handleChangeTopic(item)}
                                            key={item.id}
                                        >
                                            <CheckBox
                                                checked={
                                                    item === topicSelected ||
                                                    topicSelected === undefined
                                                }
                                            />
                                            <View
                                                style={[
                                                    stylescomp.topic,
                                                    { backgroundColor: item.backgroundColor },
                                                ]}
                                            >
                                                <View style={stylescomp.emoji_container}>
                                                    <Text style={[styles.text, { fontSize: 14 }]}>
                                                        {item.emoji}
                                                    </Text>
                                                </View>
                                                <Text style={styles.idea_msg}>{item.name}.</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item.id + ''}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescomp = StyleSheet.create({
    container: {
        minHeight: 300,
        width: 260,
        backgroundColor: '#ffff',
        borderRadius: 14,
        paddingHorizontal: 25,
        paddingVertical: 15,
    },
    topic: {
        ...styles.flex_start,
        borderRadius: 14,
        marginHorizontal: 10,
        paddingLeft: 10,
        paddingVertical: 5,
        flex: 1,
    },
    emoji_container: {
        ...styles.flex_center,
        backgroundColor: '#ffff',
        borderRadius: 15,
        height: 25,
        width: 25,
        marginRight: 10,
    },
});
