import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CheckEmailScreen } from '../screens/CheckEmailScreen';
import { ForgotPwdScreen } from '../screens/ForgotPwdScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { MenuMain } from './MenuMain';
import { CreateIdeaScreen } from '../screens/CreateIdeaScreen';
import { OpenedIdeaScreen } from '../screens/OpenedIdeaScreen';
import { ManifestPart1Screen } from '../screens/ManifestPart1Screen';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import SpikyService from '../services/SpikyService';
import { setUniversities } from '../store/feature/ui/uiSlice';
import { Message, University, User } from '../types/store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { TermAndConditionsScreen } from '../screens/TermAndConditionsScreen';

export type RootStackParamList = {
    HomeScreen: undefined;
    LoginScreen: undefined;
    CheckEmail: undefined;
    CheckEmailScreen: undefined;
    ForgotPwdScreen: undefined;
    RegisterScreen: undefined;
    MenuMain: undefined;
    CreateIdeaScreen: undefined;
    OpenedIdeaScreen: undefined;
    ManifestPart1Screen: undefined;
    TermAndConditionsScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigator = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const universities = useAppSelector((state: RootState) => state.ui.universities);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const uid = useAppSelector((state: RootState) => state.user.id);

    async function setSessionInfo() {
        const spikyClient = new SpikyService(config);
        try {
            const { data: universitiesData } = await spikyClient.getUniversities();
            const { universidades } = universitiesData;
            const universitiesResponse: University[] = universidades.map<University>(
                university => ({
                    id: university.id_universidad ?? 0,
                    shortname: university.alias,
                })
            );
            dispatch(setUniversities(universitiesResponse));
        } catch {
            dispatch(
                addToast({ message: 'Error cargando universidades', type: StatusType.WARNING })
            );
        }
        try {
            const messagesResponse = await spikyClient.getMessages(uid, 1);
            const { data: messagesData } = messagesResponse;
            const { mensajes } = messagesData;
            const messagesRetrived: Message[] = mensajes.map(message => {
                const university: University = {
                    id: message.usuario.id_universidad,
                    shortname: message.usuario.universidad.alias,
                };
                const user: User = {
                    alias: message.usuario.alias,
                    university,
                };
                return {
                    id: message.id_mensaje,
                    message: message.mensaje,
                    date: message.fecha,
                    favor: message.favor,
                    neutral: message.neutro,
                    aggainst: message.contra,
                    user,
                    reactions: message.reacciones,
                    trackings: message.trackings,
                    answersNumber: message.num_respuestas,
                    draft: message.draft,
                };
            });
            dispatch(setMessages(messagesRetrived));
        } catch {
            dispatch(addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING }));
        }
    }

    useEffect(() => {
        if (token && !universities && !messages) {
            setSessionInfo();
        }
    }, [token, universities, messages, config]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'white',
                },
            }}
        >
            {!token ? (
                <>
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="CheckEmailScreen" component={CheckEmailScreen} />
                    <Stack.Screen name="ForgotPwdScreen" component={ForgotPwdScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    <Stack.Screen name="ManifestPart1Screen" component={ManifestPart1Screen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="MenuMain" component={MenuMain} />
                    <Stack.Screen name="CreateIdeaScreen" component={CreateIdeaScreen} />
                    <Stack.Screen name="OpenedIdeaScreen" component={OpenedIdeaScreen} />
                    <Stack.Screen
                        name="TermAndConditionsScreen"
                        component={TermAndConditionsScreen}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};
