import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, TouchableWithoutFeedback, View, TouchableOpacity, StyleSheet } from 'react-native';
import { faCheck, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';

interface Props {
    setReactComment: (value: boolean) => void;
    reactComment: boolean;
    position: {
        top: number;
        left: number;
    };
}

export const ModalReactComment = ({ reactComment, setReactComment, position }:Props) => {
    const { top, left } = position;

    return (
        <Modal animationType="fade" visible={reactComment} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setReactComment(false)}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    
                    <TouchableWithoutFeedback>
                        <View 
                            style={{
                                backgroundColor: '#ffff',
                                paddingVertical: 8,
                                paddingHorizontal: 5,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                elevation: 7,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'absolute',
                                flexDirection: 'row',
                                width: 150,
                                top: top -52,
                                left: left +5,
                            }}
                        >
                            <TouchableOpacity
                                style={ stylescom.button}
                                onPress={ () => {} }
                            >
                                <FontAwesomeIcon icon={faCheck} size={20} color='white'/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ stylescom.button}
                                onPress={ () => {} }
                            >
                                <FontAwesomeIcon icon={faXmark} size={20} color='white'/>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const stylescom = StyleSheet.create({
    button:{
        ...styles.center,
        backgroundColor:'#01192E',
        paddingVertical: 3,
        borderRadius: 3, 
        marginHorizontal: 5,
        flex: 1,
    }
});