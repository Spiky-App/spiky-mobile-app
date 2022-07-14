import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import { faFilter } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { faHourglass3 } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
}

export const IdeasHeader = ({ title }: Props) => {
  return (
    <View style={stylecom.filterWrap}>
      <Text style={{ ...styles.text, ...styles.h3 }}>
        {title}
        <Text style={styles.orange}>.</Text>
      </Text>

      <TouchableHighlight
        style={stylecom.filterContainer}
        underlayColor="#01192E"
        onPress={() => {}}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FontAwesomeIcon icon={faFilter} color="white" size={17} />
          <Text style={{ ...stylecom.filterText }}>Filtros.</Text>
        </View>
      </TouchableHighlight>
    </View>
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
});
