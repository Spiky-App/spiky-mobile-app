import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { CheckBox } from './CheckBox';

interface Props {
    setModalFilter: (value: boolean) => void;
    modalFilter: boolean;
}

export const ModalFilters = ({ modalFilter, setModalFilter }: Props) => {
    const universities = useAppSelector((state: RootState) => state.ui.universities);
    const [formValues, setFormValues] = useState<any>({
        [0]: false,
    });

    const handleChange = (id: number) => {
        setFormValues({ ...formValues, [id]: !formValues[id] });
    };

    useEffect(() => {
        if (universities?.length !== 0) {
            let objUnivers = {};
            universities?.forEach(item => (objUnivers = { ...objUnivers, [item.id]: false }));
            setFormValues({ ...formValues, ...objUnivers });
        }
    }, [universities]);

    return (
        <Modal animationType="fade" visible={modalFilter} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setModalFilter(false)}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                ...stylecom.container,
                                paddingHorizontal: 25,
                                paddingVertical: 15,
                            }}
                        >
                            <View style={{ ...styles.flex, justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.text, ...styles.h3 }}>
                                    Filtros
                                    <Text style={styles.orange}>.</Text>
                                </Text>

                                <TouchableOpacity style={styles.center}>
                                    <Text style={{ ...styles.text, ...styles.link }}>
                                        Restaurar
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{ ...styles.text, ...styles.textGray, marginTop: 10 }}>
                                Universidades:
                            </Text>

                            <View style={{ marginLeft: 20, marginTop: 15 }}>
                                <TouchableOpacity
                                    style={{ ...styles.flex, marginBottom: 10 }}
                                    onPress={() => handleChange(0)}
                                >
                                    <CheckBox checked={formValues[0]} />
                                    <Text style={{ ...styles.text, fontSize: 13, marginLeft: 6 }}>
                                        Seleccionar todas
                                    </Text>
                                </TouchableOpacity>

                                <FlatList
                                    data={universities}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ ...styles.flex, marginBottom: 10 }}
                                            onPress={() => handleChange(item.id)}
                                            key={item.id}
                                        >
                                            <CheckBox checked={formValues[item.id]} />
                                            <Text
                                                style={{
                                                    ...styles.text,
                                                    fontSize: 13,
                                                    marginLeft: 6,
                                                }}
                                            >
                                                {item.shortname}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item.id + ''}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>

                            <View style={{ ...styles.center, marginTop: 25 }}>
                                <TouchableOpacity style={styles.button} onPress={() => {}}>
                                    <Text style={{ ...styles.text, fontSize: 11 }}>Aplicar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylecom = StyleSheet.create({
    container: {
        minHeight: 300,
        width: 260,
        backgroundColor: '#ffff',
        borderRadius: 5,
    },
});
