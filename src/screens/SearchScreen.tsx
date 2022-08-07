import React, { useEffect } from 'react';
import {
    Animated,
    FlatList,
    Keyboard,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { Idea } from '../components/Idea';
import { IdeasHeader } from '../components/IdeasHeader';
import { styles } from '../themes/appTheme';
import { faMagnifyingGlass } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useAnimation } from '../hooks/useAnimation';
import { useMensajes } from '../hooks/useMensajes';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';

export const SearchScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(function () {
        movingPosition(-50, 0, 700);
        dispatch(setFilter('/search'));
        console.log('filter: /search');
    }, []);
    const { messages, loading, moreMsg } = useMensajes();

    const { position, movingPosition } = useAnimation();
    const { onChange } = useForm({
        search: '',
    });

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
                            onChangeText={value => onChange({ search: value })}
                            style={styles.textinput}
                            autoCorrect={false}
                        />
                        <TouchableOpacity style={styles.iconinput} onPress={() => {}}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="#d4d4d4" />
                        </TouchableOpacity>
                    </Animated.View>

                    <IdeasHeader title="Explorando" />

                    {messages?.length !== 0 ? (
                        <FlatList
                            style={{ width: '90%' }}
                            data={messages}
                            renderItem={({ item }) => <Idea idea={item} />}
                            keyExtractor={item => item.id + ''}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={
                                loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>
                            }
                            ListFooterComponentStyle={{ marginVertical: 12 }}
                        />
                    ) : loading ? (
                        <LoadingAnimated />
                    ) : (
                        <EmptyState message="Todos buscamos algo, espero que lo encuentres." />
                    )}

                    <FloatButton />
                </>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};
