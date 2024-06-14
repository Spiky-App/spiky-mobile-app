import React, { useCallback, useContext, useEffect } from 'react';
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
import { TermAndConditionsScreen } from '../screens/TermAndConditionsScreen';
import { ReplyIdeaScreen } from '../screens/ReplyIdeaScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChangeForgotPasswordScreen } from '../screens/ChangeForgotPasswordScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import SocketContext from '../context/Socket/Context';
import { IdeaType, University, User } from '../types/store';
import useSpikyService from '../hooks/useSpikyService';
import { ManifestPart2Screen } from '../screens/ManifestPart2Screen';
import { setUniversities } from '../store/feature/ui/uiSlice';
import { setNotificationsAndNewChatMessagesNumber } from '../store/feature/user/userSlice';
import { CreatePollScreen } from '../screens/CreatePollScreen';
import { CreateMoodScreen } from '../screens/CreateMoodScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../types/storage';
import { CreateQuoteScreen } from '../screens/CreateQuoteScreen';

export type RootStackParamList = {
    HomeScreen: undefined;
    LoginScreen: undefined;
    CheckEmail: undefined;
    CheckEmailScreen: undefined;
    ForgotPwdScreen: undefined;
    ChangePasswordScreen: undefined;
    RegisterScreen: { token: string; correoValid: string };
    MenuMain: undefined;
    CreateIdeaScreen: { draftedIdea?: string; draftID?: number } | undefined;
    OpenedIdeaScreen: { ideaId: number; filter?: string };
    ManifestPart1Screen: undefined;
    TermAndConditionsScreen: undefined;
    ReportIdeaScreen: { ideaId: number };
    ReplyIdeaScreen: {
        idea: {
            id: number;
            message: string;
            user: User;
            date: number;
            type: IdeaType;
        };
    };
    ChatScreen: { conversationId: number; toUser: User };
    ChangeForgotPasswordScreen: { token: string; correoValid: string };
    ManifestPart2Screen: { correoValid: string; password: string };
    CreatePollScreen: undefined;
    CreateMoodScreen: undefined;
    CreateQuoteScreen: {
        idea: {
            id: number;
            message: string;
            date: number;
            user: User;
            type: IdeaType;
            anonymous: boolean;
        };
    };
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigator = () => {
    const token = useAppSelector((state: RootState) => state.auth.token);
    const appState = useAppSelector((state: RootState) => state.ui.appState);
    const dispatch = useAppDispatch();
    const { socket } = useContext(SocketContext);
    const { setSessionInfo, getPendingNotifications } = useSpikyService();

    async function handleSessionInfo() {
        if (token) {
            const unversities = await setSessionInfo();
            if (unversities) {
                const universitiesResponse: University[] = unversities.map<University>(
                    university => ({
                        id: university.id_universidad,
                        shortname: university.alias,
                        color: university.color,
                        backgroundColor: university.background_color,
                    })
                );
                dispatch(setUniversities(universitiesResponse));
            }
        }
    }

    async function handleGetPendingNotf() {
        if (token) {
            const pendingNotifications = await getPendingNotifications();
            if (pendingNotifications) {
                const {
                    newChatMessagesNumber: newChatMessagesNumberS,
                    notificationsNumber: notificationsNumberS,
                } = pendingNotifications;
                dispatch(
                    setNotificationsAndNewChatMessagesNumber({
                        newChatMessagesNumber: newChatMessagesNumberS,
                        notificationsNumber: notificationsNumberS,
                    })
                );
            }
        }
    }

    const handleUserSession = useCallback(async () => {
        if (token) {
            if (appState === 'inactive') {
                const sessionId = (await AsyncStorage.getItem(StorageKeys.SESSION_ID)) as string;
                socket?.emit('force-offline', Number(sessionId));
                await AsyncStorage.removeItem(StorageKeys.SESSION_ID);
            } else {
                socket?.emit('force-online', {});
            }
        }
    }, [appState, socket, token]);

    // I changed this because the token in store.auth can be
    // defined before config.headers.x-token that is the one
    // that we actually use here
    // TODO: centralize in one place where to put the token,
    // because i think it is saved in axios, in SecureStorage
    // and in store's auth.token

    useEffect(() => {
        if (appState === 'active' && token) {
            handleGetPendingNotf();
        }
    }, [appState, token]);

    useEffect(() => {
        handleUserSession();
    }, [handleUserSession]);

    useEffect(() => {
        handleSessionInfo();
    }, [token]);

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
                    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    <Stack.Screen name="ManifestPart1Screen" component={ManifestPart1Screen} />
                    <Stack.Screen
                        name="ChangeForgotPasswordScreen"
                        component={ChangeForgotPasswordScreen}
                    />
                    <Stack.Screen name="ManifestPart2Screen" component={ManifestPart2Screen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="MenuMain" component={MenuMain} />
                    <Stack.Screen name="CreateIdeaScreen" component={CreateIdeaScreen} />
                    <Stack.Screen name="OpenedIdeaScreen" component={OpenedIdeaScreen} />
                    <Stack.Screen name="ReplyIdeaScreen" component={ReplyIdeaScreen} />
                    <Stack.Screen name="ChatScreen" component={ChatScreen} />
                    <Stack.Screen name="CreatePollScreen" component={CreatePollScreen} />
                    <Stack.Screen name="CreateMoodScreen" component={CreateMoodScreen} />
                    <Stack.Screen name="CreateQuoteScreen" component={CreateQuoteScreen} />
                </>
            )}
            <Stack.Screen name="TermAndConditionsScreen" component={TermAndConditionsScreen} />
        </Stack.Navigator>
    );
};
