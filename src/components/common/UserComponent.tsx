import React from 'react';
import { faClock } from '../../constants/icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, View, Pressable } from 'react-native';
import { styles } from '../../themes/appTheme';
import { getTime } from '../../helpers/getTime';
import UniversityTag from './UniversityTag';
import { User } from '../../types/store';

interface Props {
    user: User;
    anonymous: boolean;
    date: number;
    handleClickUser: (goToUser: User) => void;
    small?: boolean;
}

function UserComponent({ user, anonymous, date, handleClickUser, small }: Props) {
    const fecha = getTime(date.toString());

    if (anonymous) {
        return (
            <View style={styles.button_user}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.idea_label}>
                        <Text style={{ ...styles.text_button, fontSize: 10 }}>Super anónimo</Text>
                    </View>
                    <View style={styles.flex_center}>
                        <FontAwesomeIcon
                            icon={faClock}
                            color="#B9B9B9"
                            size={10}
                            style={{ marginLeft: 4, marginRight: 2 }}
                        />
                        <Text style={styles.number}>{fecha}</Text>
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <Pressable onPress={() => handleClickUser(user)} style={{ alignSelf: 'flex-start' }}>
                <View style={styles.button_user}>
                    <Text style={[styles.user, small && { fontSize: 12 }]}>{user.nickname}</Text>
                    <UniversityTag id={user.universityId} fontSize={small ? 12 : 14} />
                    <View style={styles.flex_center}>
                        <FontAwesomeIcon
                            icon={faClock}
                            color="#B9B9B9"
                            size={small ? 9 : 10}
                            style={{ marginLeft: 4, marginRight: 2 }}
                        />
                        <Text style={[styles.number, small && { fontSize: 11 }]}>{fecha}</Text>
                    </View>
                </View>
            </Pressable>
        );
    }
}

export default UserComponent;
