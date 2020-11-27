/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
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

const openCB = () => {
  console.log('Database OPENED');
};

const db = SQLite.openDatabase(
  {name: 'my.db', location: 'default'},
  openCB,
  errorCB,
);

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
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [county, setCounty] = useState([]);

  useEffect(() => {
    if (result.length > 1) insertDataToDB(result);
  }, [result]);

  const insertDataToDB = (data) => {
    let values = '';
    let endStatement = ',';

    //real data
    for (let i = 0; i < data.length; i++) {
      if (i + 1 === data.length) endStatement = '';
      values += `('${data[i].State}', '${data[i].City}', '${data[i].County}', '${data[i].PostalCode}')${endStatement}`;
    }

    db.transaction((tx) => {
      console.time('sql insert rows');

      tx.executeSql('DROP TABLE IF EXISTS addresses', [], () => {}, errorCB);
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS addresses( ' +
          'id INTEGER PRIMARY KEY NOT NULL, ' +
          'state TEXT, ' +
          'city TEXT, ' +
          'county TEXT, ' +
          'zip TEXT ); ',
        [],
        () => {},
        errorCB,
      );
      tx.executeSql(
        `INSERT INTO addresses (state, city, county, zip) VALUES ${values}`,
        [],

        successInsertRows,
        errorCB,
      );
    });
  };

  const successInsertRows = (tx, result) => {
    console.timeEnd('sql insert rows');
    console.log('SQL executed fine', result.rows.length);

    console.time('sql select query');

    tx.executeSql(
      'SELECT distinct state FROM addresses',
      [],
      (tx, result) => {
        setDataToSelect(result, setStates, 'state');
      },
      errorCB,
    );
  };

  const _handleStateChange = (val) => {
    setCities([]);
    setCounty([]);

    db.transaction((tx) => {
      console.time('sql select query');

      tx.executeSql(
        `SELECT distinct city FROM addresses where state = '${val}'`,
        [],
        (tx, result) => {
          setDataToSelect(result, setCities, 'city');
        },
        errorCB,
      );
    });
  };

  const _handleCitiesChange = (val) => {
    setCounty([]);

    db.transaction((tx) => {
      console.time('sql select query');

      tx.executeSql(
        `SELECT distinct county FROM addresses where city = '${val}'`,
        [],
        (tx, result) => {
          setDataToSelect(result, setCounty, 'county');
        },
        errorCB,
      );
    });
  };

  const _handleCountyChange = (val) => {
    console.log(val);
  };

  const setDataToSelect = (result, setData, prop) => {
    let data = [];
    const {rows} = result;

    for (let i = 0; i < rows.length; i++) {
      data.push(rows.item(i)[prop]);
    }

    data = data.sort().map((el) => ({key: el, value: el}));
    setData(data);

    console.timeEnd('sql select query');
  };

  // if (result.length > 1) {
  //   console.log('Items', result.length);
  //   // handle to save to db
  //   console.time('Filtering states in');
  //   const filteredStates = [...new Set(result.map((el) => el.State))];
  //   const states = filteredStates
  //     .sort()
  //     .map((state) => ({key: state, value: state}));
  //   console.log(states);∫
  //   console.timeEnd('Filtering states in');
  // }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView styles={styles.container}>
        <Text>Downloading data {Math.round(percent * 100)}</Text>
        <Select data={states} onSelected={_handleStateChange} />
        <Select data={cities} onSelected={_handleCitiesChange} />
        <Select data={county} onSelected={_handleCountyChange} />
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
