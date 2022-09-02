import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';

export const TrackingScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <MessagesFeed params={{}} filter={'/tracking'} title={'Siguiendo'} myideas={false} />
            <FloatButton />
        </BackgroundPaper>
    );
};
