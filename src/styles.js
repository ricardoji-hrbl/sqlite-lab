import {Dimensions, StyleSheet} from 'react-native';

const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.27,
  shadowRadius: 3,
  elevation: 2,
};

export default StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#f6f6f6',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    height: Dimensions.get('window').height - 150,
  },
  searchField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 15,
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  item: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#78be20',
  },
  select: {
    backgroundColor: '#ffffff',
    height: 40,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#78be20',
    padding: 12,
    ...shadow,
  },
});
