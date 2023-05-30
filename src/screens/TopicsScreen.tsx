import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { EmptyState } from '../components/EmptyState';
import { IdeasHeader } from '../components/IdeasHeader';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { styles } from '../themes/appTheme';
import { Topic, TopicQuestion } from '../types/store';
import { faAngleRight, faComments } from '../constants/icons/FontAwesome';
import NetworkErrorFeed from '../components/NetworkErrorFeed';
import useSpikyService from '../hooks/useSpikyService';
import { topicQuestionRetrived } from '../helpers/message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ModalFiltersTopics } from '../components/ModalFiltersTopics';
import { FloatButton } from '../components/FloatButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigator/MenuMain';

type NavigationDrawerProp = DrawerNavigationProp<DrawerParamList>;

export const TopicsScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [isModalTopicFilterOpen, setIsModalTopicFilterOpen] = useState(false);
    const [topicSelected, setTopicSelected] = useState<Topic | undefined>(undefined);
    const { getTopicQuestions } = useSpikyService();
    const [topicQuestions, setTopicQuestions] = useState<TopicQuestion[]>([]);
    const navigation = useNavigation<NavigationDrawerProp>();

    const LoadingConversations = () =>
        isLoading ? (
            <LoadingAnimated />
        ) : (
            <EmptyState message="Se el primero en crear una discución." />
        );

    function handleOpenTopicQuestion(item: TopicQuestion) {
        navigation.navigate('TopicQuestionsScreen', { topicQuestion: item });
    }

    async function handleGetTopicQuestions() {
        setIsLoading(true);
        const { topic_questions: topicQuestionsRetrieved, networkError: networkErrorRetrieved } =
            await getTopicQuestions(topicSelected?.id);
        if (topicQuestionsRetrieved) {
            setTopicQuestions(topicQuestionsRetrieved.map(tq => topicQuestionRetrived(tq)));
        }
        if (networkErrorRetrieved) setNetworkError(true);
        setIsLoading(false);
    }

    useEffect(() => {
        handleGetTopicQuestions();
    }, [topicSelected]);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader
                title={'Discuiones'}
                connections={true}
                icon={faComments}
                blocked_user={''}
            />
            <View style={stylescomp.filter_container}>
                <View style={{ marginRight: 6 }}>
                    <Text style={{ ...styles.text_button, fontSize: 14, ...styles.h5 }}>
                        Tópico:
                    </Text>
                </View>
                <Pressable
                    style={stylescomp.button_topic}
                    onPress={() => setIsModalTopicFilterOpen(true)}
                >
                    <Text style={styles.h7}>
                        {topicSelected ? topicSelected.name + '.' : 'Todos.'}
                    </Text>
                </Pressable>
            </View>
            <View style={[styles.flex_center, { flex: 1, alignItems: 'flex-start' }]}>
                {networkError ? (
                    <NetworkErrorFeed callback={handleGetTopicQuestions} />
                ) : topicQuestions?.length !== 0 ? (
                    <FlatList
                        data={topicQuestions}
                        renderItem={({ item }) => (
                            <TopicQuestionItem
                                topicQuestion={item}
                                handleOpenTopicQuestion={handleOpenTopicQuestion}
                            />
                        )}
                        keyExtractor={item => item.id + ''}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ marginTop: 5, flexGrow: 1 }}
                    />
                ) : (
                    <LoadingConversations />
                )}
            </View>
            <ModalFiltersTopics
                topicSelected={topicSelected}
                setTopicSelected={setTopicSelected}
                isModalOpen={isModalTopicFilterOpen}
                setIsModalOpen={setIsModalTopicFilterOpen}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};

interface TopicQuestionItemProp {
    topicQuestion: TopicQuestion;
    handleOpenTopicQuestion: (item: TopicQuestion) => void;
}

const TopicQuestionItem = ({ topicQuestion, handleOpenTopicQuestion }: TopicQuestionItemProp) => {
    return (
        <TouchableOpacity onPress={() => handleOpenTopicQuestion(topicQuestion)}>
            <View style={stylescomp.converWrap}>
                <View
                    style={[
                        stylescomp.topic,
                        { backgroundColor: topicQuestion.topic.backgroundColor },
                    ]}
                >
                    <View style={stylescomp.emoji_container}>
                        <Text style={styles.h5}>{topicQuestion.topic.emoji}</Text>
                    </View>
                    <Text style={styles.idea_msg}>{topicQuestion.question}</Text>
                    <View style={[styles.flex_center, { marginLeft: 5 }]}>
                        <Text style={[styles.text, { fontSize: 18 }]}>
                            {topicQuestion.totalIdeas}
                        </Text>
                        <FontAwesomeIcon icon={faAngleRight} size={24} color={styles.text.color} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const stylescomp = StyleSheet.create({
    converWrap: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    topic: {
        ...styles.shadow,
        borderRadius: 14,
        ...styles.flex_center,
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignSelf: 'flex-start',
        width: '92%',
    },
    emoji_container: {
        ...styles.flex_center,
        backgroundColor: '#ffff',
        borderRadius: 15,
        height: 35,
        width: 35,
        marginRight: 10,
    },
    filter_container: {
        ...styles.flex_center,
        width: '90%',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    button_topic: {
        ...styles.shadow_button,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
