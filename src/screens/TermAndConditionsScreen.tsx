import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import NetworkErrorFeed from '../components/NetworkErrorFeed';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { faChevronRight } from '../constants/icons/FontAwesome';
import { useAnimation } from '../hooks/useAnimation';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { TermsAndConditions } from '../types/services/spiky';

export const TermAndConditionsScreen = () => {
    const [terms, setTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [aux, setAux] = useState(true);
    const [info, setInfo] = useState<TermsAndConditions | null>(null);
    const [title, setTitle] = useState(['Aviso de ', 'privacidad']);
    const [alternateTitle, setAlternateTitle] = useState(['Términos y ', 'condiciones']);
    const refScrollView = useRef<ScrollView>(null);
    const { getTermsAndConditions } = useSpikyService();
    const { opacity, fadeIn, fadeOut } = useAnimation({});

    const loadData = async () => {
        if (networkError) setNetworkError(false);
        const { termsAndConditions: list, networkError: networkErrorReturn } =
            await getTermsAndConditions();
        if (networkErrorReturn) setNetworkError(true);
        if (list) {
            setInfo(list);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!info) loadData();
    }, []);

    useEffect(() => {
        if (info) {
            fadeOut(400, () => {
                setTitle(alternateTitle);
                setAlternateTitle(title);
                setTerms(value => !value);
                refScrollView.current?.scrollTo();
                fadeIn(400, () => {}, 300);
            });
        }
    }, [aux, info]);

    return (
        <BackgroundPaper>
            <View style={{ ...styles.center, marginTop: 40, width: '100%', flex: 1 }}>
                {!networkError ? (
                    isLoading ? (
                        <View style={{ ...styles.center, flex: 1 }}>
                            <LoadingAnimated />
                        </View>
                    ) : (
                        <Animated.View style={{ ...styles.center, marginBottom: 40, opacity }}>
                            <BigTitle texts={title} fontSize={35} />
                            <ContainerInfo
                                sections={terms ? info?.termsAndConditions : info?.noticeOfPrivacy}
                                refScrollView={refScrollView}
                            />
                            <TouchableOpacity
                                style={{
                                    ...styles.center,
                                    flexDirection: 'row',
                                    paddingBottom: 10,
                                }}
                                onPress={() => setAux(value => !value)}
                            >
                                <Text style={{ ...styles.text, ...styles.link, fontSize: 16 }}>
                                    {alternateTitle}
                                </Text>
                                <FontAwesomeIcon icon={faChevronRight} color="#5c71ad" size={16} />
                            </TouchableOpacity>
                        </Animated.View>
                    )
                ) : (
                    <NetworkErrorFeed callback={loadData} />
                )}
            </View>
            <ArrowBack />
        </BackgroundPaper>
    );
};

interface PropsInfo {
    sections?: {
        title: string;
        paragraphs: string[];
    }[];
    refScrollView: React.RefObject<ScrollView>;
}

const ContainerInfo = ({ sections, refScrollView }: PropsInfo) => {
    return (
        <View style={stylescom.container}>
            <ScrollView ref={refScrollView}>
                {sections &&
                    sections.map(section => (
                        <View key={section.title} style={{ marginBottom: 20 }}>
                            <Text style={{ ...styles.text, ...styles.h3 }}>{section.title}</Text>
                            {section.paragraphs.map(paragraph => (
                                <Text
                                    key={paragraph}
                                    style={{
                                        ...styles.text,
                                        fontSize: 14,
                                        textAlign: 'justify',
                                        marginBottom: 10,
                                    }}
                                >
                                    {paragraph}
                                </Text>
                            ))}
                        </View>
                    ))}
            </ScrollView>
        </View>
    );
};

const stylescom = StyleSheet.create({
    container: {
        ...styles.shadow,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: '#ffff',
        maxHeight: '80%',
    },
});
