import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';

export const MyIdeasScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Mis ideas" myideas={true} />
            <MessagesFeed params={{}} filter={'/user'} />
            <FloatButton />
        </BackgroundPaper>
    );
};
