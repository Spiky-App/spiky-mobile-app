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
import { useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUniversitiesFilter } from '../store/feature/messages/messagesSlice';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { CheckBox } from './CheckBox';

interface Props {
    setModalFilter: (value: boolean) => void;
    modalFilter: boolean;
}

export const ModalFilters = ({ modalFilter, setModalFilter }: Props) => {
    const universities = useAppSelector((state: RootState) => state.ui.universities);
    const [formValues, setFormValues] = useState<{ [id: string]: boolean }>({
        [0]: false,
    });
    const [selectAll, setSelectAll] = useState(false);
    useEffect(() => {
        if (universities?.length !== 0) {
            let objUnivers = {};
            universities?.forEach(
                item => item.id && (objUnivers = { ...objUnivers, [item.id]: selectAll })
            );
            setFormValues({ ...formValues, ...objUnivers, ...{ [0]: selectAll } });
        }
    }, [universities, selectAll]);

    const handleChange = (id: number) => {
        if (id === 0) {
            setSelectAll(!selectAll);
        } else {
            setFormValues({ ...formValues, [id]: !formValues[id] });
        }
    };
    const dispatch = useDispatch();
    const submitFilter = () => {
        const filters = Object.keys(formValues)
            .filter(n => formValues[n] && n != '0')
            .join('|');
        dispatch(setUniversitiesFilter(filters));
        setModalFilter(false);
    };

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
                                <TouchableOpacity style={styles.button} onPress={submitFilter}>
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
