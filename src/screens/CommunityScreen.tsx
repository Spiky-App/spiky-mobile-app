import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import { IdeasHeader } from '../components/IdeasHeader';
import MessagesFeed from '../components/MessagesFeed';

export const CommunityScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Comunidad" />
            <MessagesFeed params={{}} filter={''} />
            <FloatButton />
        </BackgroundPaper>
    );
};
