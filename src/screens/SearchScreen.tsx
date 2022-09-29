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
import { styles } from '../themes/appTheme';
import { faMagnifyingGlass } from '../constants/icons/FontAwesome';
import { FloatButton } from '../components/FloatButton';
import { useAnimation } from '../hooks/useAnimation';
import MessagesFeed from '../components/MessagesFeed';

export const SearchScreen = () => {
    const { position, movingPosition } = useAnimation();
    const [search, setSearch] = useState('');

    useEffect(() => {
        movingPosition(-50, 0, 700);
    }, []);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }} hasHeader={true}>
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
                        <TouchableOpacity style={styles.iconinput} onPress={() => {}}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="#d4d4d4" />
                        </TouchableOpacity>
                    </Animated.View>

                    <MessagesFeed
                        params={{ search }}
                        filter={'/search'}
                        title={'Explorando'}
                        myideas={false}
                        icon={faMagnifyingGlass}
                    />
                    <FloatButton />
                </>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};
