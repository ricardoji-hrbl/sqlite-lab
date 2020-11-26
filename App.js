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

// SQLite.enablePromise(true);

const errorCB = (err) => {
  console.log('SQL Error:', err);
};

const successCB = (tx, result) => {
  console.log('SQL executed fine', result.rows.length);
  const {rows} = result;
  console.timeEnd('test');
  // for (let i = 0; i < rows.length; i++) {
  //   console.log(rows.item(i));
  // }
};

const openCB = () => {
  console.log('Database OPENED');
};

const data = [
  'state1',
  'city1',
  'neigh1',
  'zip1',
  'state2',
  'city2,',
  'neigh2',
  'zip1',
];

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
  console.time('test');
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

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>Test</Text>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
