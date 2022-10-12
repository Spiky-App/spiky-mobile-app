import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';
import { faThumbtack } from '../constants/icons/FontAwesome';

export const TrackingScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }} hasHeader={true}>
            <MessagesFeed
                params={{}}
                filter={'/tracking'}
                title={'Siguiendo'}
                myideas={false}
                icon={faThumbtack}
                emptyTitle={'Haz tracking en las ideas que revolucionan.'}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
