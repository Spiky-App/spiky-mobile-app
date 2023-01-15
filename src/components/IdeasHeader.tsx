import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { faFilter } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { ModalFilters } from './ModalFilters';
import { useAnimation } from '../hooks/useAnimation';
import { setDraft } from '../store/feature/messages/messagesSlice';
import { useDispatch } from 'react-redux';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Props {
    title: string;
    myideas?: boolean;
    connections?: boolean;
    profile?: boolean;
    icon: IconDefinition;
}

export const IdeasHeader = ({ title, myideas, connections, icon, profile }: Props) => {
    const [modalFilter, setModalFilter] = useState(false);
    const [activeDraft, setActiveDraft] = useState(false);
    const { opacity, fadeIn } = useAnimation({});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDraft(activeDraft));
        fadeIn(800);
    }, [activeDraft, myideas]);

    return (
        <Animated.View
            style={{
                ...stylecom.filterWrap,
                opacity,
            }}
        >
            <View style={{ alignItems: 'center' }}>
                <Text style={{ ...styles.text, ...styles.h3, flexDirection: 'row' }}>
                    <Text style={{ paddingRight: 50 }}>
                        <FontAwesomeIcon icon={icon} color={'#01192E'} size={23} />
                    </Text>
                    {` ${title}`}
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>

            {!connections &&
                !profile &&
                (!myideas ? (
                    <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
                        <TouchableHighlight
                            style={stylecom.filterContainer}
                            underlayColor="#01192E"
                            onPress={() => setModalFilter(true)}
                        >
                            <View style={stylecom.flexCenter}>
                                <FontAwesomeIcon icon={faFilter} color="white" size={17} />
                                <Text style={{ ...stylecom.filterText }}>Filtros.</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                ) : (
                    <View
                        style={{
                            ...styles.center,
                            ...styles.shadow_button,
                            flexDirection: 'row',
                            backgroundColor: '#D4D4D4',
                            borderRadius: 5,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                ...stylecom.buttonDraft,
                                backgroundColor: activeDraft ? '#D4D4D4' : '#01192E',
                            }}
                            onPress={() => setActiveDraft(false)}
                        >
                            <Text style={{ ...styles.text, ...styles.h5, color: '#ffff' }}>
                                Publicadas.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                ...stylecom.buttonDraft,
                                backgroundColor: activeDraft ? '#01192E' : '#D4D4D4',
                            }}
                            onPress={() => setActiveDraft(true)}
                        >
                            <Text style={{ ...styles.text, ...styles.h5, color: '#ffff' }}>
                                Borradores.
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

            <ModalFilters setModalFilter={setModalFilter} modalFilter={modalFilter} />
        </Animated.View>
    );
};

const stylecom = StyleSheet.create({
    filterWrap: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 6,
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterContainer: {
        ...styles.shadow_button,
        backgroundColor: '#D4D4D4',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
    },
    filterText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    flexCenter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDraft: {
        ...styles.center,
        backgroundColor: '#01192E',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
    },
});
