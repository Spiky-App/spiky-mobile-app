import React, { useEffect, useState } from 'react';
import {
    Animated,
    Keyboard,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { styles } from '../themes/appTheme';
import { faMagnifyingGlass } from '../constants/icons/FontAwesome';
import { FloatButton } from '../components/FloatButton';
import { useAnimation } from '../hooks/useAnimation';
import { setFilter, setLastMessageId, setMessages } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';
import MessagesFeed from '../components/MessagesFeed';

export const SearchScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        movingPosition(-50, 0, 700);
        dispatch(setFilter('/search'));
    }, []);

    const { position, movingPosition } = useAnimation();
    const [search, setSearch] = useState('');
    // const { messages, fetchMessages, moreMsg } = useMensajes({ search });
    const handleSearch = () => {
        if (search.length > 0) {
            // reset last message id, and messages
            dispatch(setMessages([]));
            dispatch(setLastMessageId(undefined));
            // fetchMessages();
        }
    };
    // Comment if you don't want requests in every keystroke
    useEffect(() => {
        handleSearch();
    }, [search]);
    const submit = () => {
        handleSearch();
    };
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <Animated.View
                        style={{
                            ...styles.input,
                            marginTop: 14,
                            borderRadius: 10,
                            width: '90%',
                            transform: [{ translateY: position }],
                        }}
                    >
                        <TextInput
                            placeholder="Buscar"
                            onChangeText={value => setSearch(value.toLowerCase())}
                            style={styles.textinput}
                            autoCorrect={false}
                        />
                        <TouchableOpacity style={styles.iconinput} onPress={() => submit()}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="#d4d4d4" />
                        </TouchableOpacity>
                    </Animated.View>

                    <IdeasHeader title="Explorando" />
                    <MessagesFeed search={search} />
                    <FloatButton />
                </>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};
