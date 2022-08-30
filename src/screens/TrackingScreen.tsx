import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';

export const TrackingScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Siguiendo" />
            <MessagesFeed params={{}} filter={'/tracking'} />
            <FloatButton />
        </BackgroundPaper>
    );
};
