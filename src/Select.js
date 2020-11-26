import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import styles from './styles';

/**
 *
 * @author Rick Jimenez <ricardoji-c@herbalife.com>
 */
const Select = ({data, isVisible, onSelected}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [selectedText, setSelectedText] = useState('Select one item');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setSearchTerm('');
  };

  const handleOnSelected = (val) => {
    setModalVisible(false);
    setSelectedText(val);
    onSelected(val);
  };

  let filteredItems = data;

  if (searchTerm) {
    filteredItems = data.filter((item) =>
      item.value
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(searchTerm.toLowerCase().replace(/\s/g, '')),
    );
  }

  const ListItem = (item) => {
    return (
      <TouchableOpacity
        key={item.key}
        onPress={() => handleOnSelected(item.value)}>
        <View style={styles.item}>
          <Text style={{marginLeft: 10, marginVertical: 20}}>{item.value}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{padding: 10}}>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.select}>
          <Text>{selectedText}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropColor="#78be20"
        backdropOpacity={0.7}
        backdropTransitionInTiming={1000}
        avoidKeyboard>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Button title="Close" onPress={toggleModal} />

            <TextInput
              style={styles.searchField}
              placeholder="Search state"
              placeholderTextColor="#78be20"
              onChangeText={(text) => setSearchTerm(text)}
              autoCapitalize="none"
              autoCorrect={false}
              // value={value}
            />
            <FlatList
              data={filteredItems}
              renderItem={({item}) => ListItem(item)}
              initialNumToRender={15}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

Select.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  isVisible: PropTypes.bool,
  onSelected: PropTypes.func,
};

Select.defaultProps = {
  data: [],
  isVisible: false,
  onSelected: () => {},
};

export default Select;
