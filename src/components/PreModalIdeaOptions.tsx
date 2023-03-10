import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../themes/appTheme';
import { User } from '../types/store';
import { ModalIdeaOptions } from './ModalIdeaOptions';

interface Positions {
    top: number;
    left: number;
}

interface Props {
    myIdea: boolean;
    message: {
        messageId: number;
        message: string;
        user: User;
        date: number;
        messageTrackingId?: number;
    };
    setMessageTrackingId?: (value: number | undefined) => void;
    filter?: string;
    isOpenedIdeaScreen?: boolean;
}

export const PreModalIdeaOptions = ({ myIdea, message, filter, isOpenedIdeaScreen }: Props) => {
    const reactContainerRef = useRef<View>(null);
    const [position, setPosition] = useState<Positions>({ top: 0, left: 0 });
    const [ideaOptions, setIdeaOptions] = useState(false);

    function handleOpendModal() {
        reactContainerRef.current?.measure((px, py, pwidth, height, pageX, pageY) => {
            setPosition({ left: pageX, top: pageY });
        });
    }

    useEffect(() => {
        if (position.top !== 0) {
            setIdeaOptions(true);
        }
    }, [position]);

    return (
        <>
            <View style={{ position: 'relative' }}>
                <Pressable onPress={handleOpendModal}>
                    <Text ref={reactContainerRef} style={{ ...styles.textbold, ...stylescom.dots }}>
                        ...
                    </Text>
                </Pressable>
            </View>
            <ModalIdeaOptions
                setIdeaOptions={setIdeaOptions}
                ideaOptions={ideaOptions}
                position={position}
                myIdea={myIdea}
                message={message}
                filter={filter}
                isOpenedIdeaScreen={isOpenedIdeaScreen}
            />
        </>
    );
};

const stylescom = StyleSheet.create({
    dots: {
        fontWeight: '600',
        color: '#01192e5a',
        fontSize: 28,
        paddingLeft: 5,
        top: -1,
        right: -4,
    },
});
