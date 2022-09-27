import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';

export const MyIdeasScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }} hasHeader={true}>
            <MessagesFeed params={{}} filter={'/user'} title={'Mis ideas'} myideas={true} />
            <FloatButton />
        </BackgroundPaper>
    );
};
