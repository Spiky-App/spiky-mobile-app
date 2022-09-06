import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FormChat, InputChat } from '../components/InputChat';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useForm } from '../hooks/useForm';
import { RootStackParamList } from '../navigator/Navigator';
import { styles } from '../themes/appTheme';

const DEFAULT_FORM: FormChat = {
    message: '',
};

type Props = DrawerScreenProps<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = ({ route }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const { form, onChange } = useForm<FormChat>(DEFAULT_FORM);
    const conversationId = route.params?.conversationId;

    async function loadConversation() {
        setIsLoading(true);
        console.log('Hola');
        setIsLoading(false);
    }

    useEffect(() => {
        if (conversationId) {
            loadConversation();
        }
    }, [conversationId]);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'Conexiones'} connections={true} />
            {!isLoading ? (
                <View style={stylescomp.wrap}>
                    <View style={{ flex: 1 }} />
                    <InputChat form={form} onChange={onChange} />
                </View>
            ) : (
                <View style={{ ...styles.center, flex: 1 }}>
                    <LoadingAnimated />
                </View>
            )}
        </BackgroundPaper>
    );
};

const stylescomp = StyleSheet.create({
    wrap: {
        width: '75%',
        paddingBottom: 10,
        marginTop: 25,
    },
});
