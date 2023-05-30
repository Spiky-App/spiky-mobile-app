import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import { MessagesFeed } from '../components/MessagesFeed';
import { faComments } from '../constants/icons/FontAwesome';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<DrawerParamList, 'TopicQuestionsScreen'>;

export const TopicQuestionsScreen = ({ route }: Props) => {
    const topicQuestion = route?.params.topicQuestion;

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <MessagesFeed
                params={{ id_topic_question: topicQuestion.id }}
                filter={'/topic'}
                title={'Discusión'}
                myideas={false}
                icon={faComments}
                emptyTitle={'Cuestión de tiempo de que alguien hable.'}
                topicQuestion={topicQuestion}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
