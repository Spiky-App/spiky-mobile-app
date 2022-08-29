import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, View, TouchableHighlight, StyleSheet, Animated } from 'react-native';
import { faFilter } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { ModalFilters } from './ModalFilters';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAnimation } from '../hooks/useAnimation';

interface Props {
    title: string;
    myideas?: boolean;
}

export const IdeasHeader = ({ title, myideas = false }: Props) => {
    const [modalFilter, setModalFilter] = useState(false);
    const [activeDraft, setActiveDraft] = useState(false);
    const { opacity, fadeIn } = useAnimation();

    useEffect(() => {
        fadeIn(800);
    }, []);
    useEffect(() => {
        if (activeDraft) console.log('i wants the drafts');
    }, [activeDraft]);

    return (
        <Animated.View
            style={{
                ...stylecom.filterWrap,
                opacity,
            }}
        >
            <Text style={{ ...styles.text, ...styles.h3 }}>
                {title}
                <Text style={styles.orange}>.</Text>
            </Text>

            {!myideas ? (
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
            ) : (
                <View
                    style={{
                        ...styles.center,
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
            )}

            <ModalFilters setModalFilter={setModalFilter} modalFilter={modalFilter} />
        </Animated.View>
    );
};

const stylecom = StyleSheet.create({
    filterWrap: {
        marginTop: 15,
        marginBottom: 10,
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    filterContainer: {
        backgroundColor: '#D4D4D4',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
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
        flex: 1,
        borderRadius: 5,
    },
});
