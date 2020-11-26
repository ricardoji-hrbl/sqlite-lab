/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';
import 'react-native-console-time-polyfill';
import useData from './src/useData';
import Select from './src/Select';

// SQLite.enablePromise(true);

const errorCB = (err) => {
  console.log('SQL Error:', err);
};

const successCB = (tx, result) => {
  console.timeEnd('sql done');
  console.log('SQL executed fine', result.rows.length);
  // const {rows} = result;
  // for (let i = 0; i < rows.length; i++) {
  //   console.log(rows.item(i));
  // }
};

const openCB = () => {
  console.log('Database OPENED');
};

const db = SQLite.openDatabase(
  {name: 'my.db', location: 'default'},
  openCB,
  errorCB,
);

// dummy data
const total = 100000;
let values = '';
let inserts = [];

for (let i = 0; i < total; i++) {
  values += `(?,?,?,?)${i + 1 === total ? '' : ','} `;
  inserts.push(`state ${i}`);
  inserts.push(`city ${i}`);
  inserts.push(`neigh ${i}`);
  inserts.push(`zip ${i}`);
}

db.transaction((tx) => {
  console.time('sql done');
  // tx.executeSql('DROP TABLE addresses', [], successCB, errorCB);
  // tx.executeSql(
  //   'CREATE TABLE IF NOT EXISTS addresses( ' +
  //     'id INTEGER PRIMARY KEY NOT NULL, ' +
  //     'state INTEGER NOT NULL, ' +
  //     'city TEXT, ' +
  //     'neighborhood TEXT, ' +
  //     'zip TEXT ); ',
  //   [],
  //   successCB,
  //   errorCB,
  // );
  // tx.executeSql(
  //   `INSERT INTO Addresses (state, city, neighborhood, zip) VALUES ${values} ;`,
  //   inserts,
  //   successCB,
  //   errorCB,
  // );
  tx.executeSql('SELECT * FROM addresses', [], successCB, errorCB);
});

// let states = [];
// if (result.length > 1) {
//   console.time('Filtering states in');
//   const filteredStates = [...new Set(result.map((el) => el.State))];
//   states = filteredStates
//      .sort()
//      .map((state) => ({ key: state, value: state }));
//   console.timeEnd('Filtering states in');
// }
//
// let cities = [];
// if (selectedState) {
//   console.time('Filtering cities in');
//   const filteredCities = [
//     ...new Set(
//        result.filter((el) => el.State === selectedState).map((el) => el.City)
//     ),
//   ];
//   cities = filteredCities.sort().map((city) => ({ key: city, value: city }));
//   console.timeEnd('Filtering cities in');
// }
//
// let neighborhoods = [];
// if (selectedCity) {
//   console.time('Filtering neighborhoods in');
//   const filteredNeighborhoods = [
//     ...new Set(
//        result.filter((el) => el.City === selectedCity).map((el) => el.County)
//     ),
//   ];
//   neighborhoods = filteredNeighborhoods
//      .sort()
//      .map((neighbor) => ({ key: neighbor, value: neighbor }));
//   console.timeEnd('Filtering neighborhoods in');
// }

const App: () => React$Node = () => {
  const {result, percent} = useData();

  if (result.length > 1) {
    console.log('Items', result.length);
    // handle to save to db
    console.time('Filtering states in');
    const filteredStates = [...new Set(result.map((el) => el.State))];
    const states = filteredStates
      .sort()
      .map((state) => ({key: state, value: state}));
    console.log(states);
    console.timeEnd('Filtering states in');
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView styles={styles.container}>
        <Text>Downloading data {Math.round(percent * 100)}</Text>
        <Select
          data={[{key: 'key', value: 'value'}]}
          onSelected={(val) => console.log(val)}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
