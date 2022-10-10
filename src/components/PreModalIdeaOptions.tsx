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
}

export const PreModalIdeaOptions = ({ myIdea, message, filter }: Props) => {
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
            <Pressable onPress={handleOpendModal}>
                <View>
                    <Text ref={reactContainerRef} style={{ ...styles.textbold, ...stylescom.dots }}>
                        ...
                    </Text>
                </View>
            </Pressable>
            <ModalIdeaOptions
                setIdeaOptions={setIdeaOptions}
                ideaOptions={ideaOptions}
                position={position}
                myIdea={myIdea}
                message={message}
                filter={filter}
            />
        </>
    );
};

const stylescom = StyleSheet.create({
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 22,
        marginLeft: 20,
    },
});
