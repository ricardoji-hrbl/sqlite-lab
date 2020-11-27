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
  TextInput,
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
  {name: 'addresses.db', location: 'default'},
  openCB,
  errorCB,
);

const App: () => React$Node = () => {
  const {result, percent} = useData();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [county, setCounty] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (result.length > 1) {
      insertDataToDB(result);
    }
  }, [result]);

  const insertDataToDB = (data) => {
    let values = '';
    let endStatement = ',';

    //real data
    for (let i = 0; i < data.length; i++) {
      if (i + 1 === data.length) {
        endStatement = '';
      }
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

    setSelectedCity('');
    setSelectedState(val);

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

    setSelectedCity(val);

    db.transaction((tx) => {
      console.time('sql select query');

      tx.executeSql(
        `SELECT distinct county FROM addresses where state = '${selectedState}' and city = '${val}'`,
        [],
        (tx, result) => {
          setDataToSelect(result, setCounty, 'county');
        },
        errorCB,
      );
    });
  };

  const _handleCountyChange = async (val) => {
    console.log(val);
    console.log(
      await db.transaction((tx) => {
        /* quedon chingon solo hay que especificar la colonia aqui por que hay muchas duplicadas
        por ejemplo aguascalientes / cosio / el durazno. regresa varios zip supongo que agregandole un AND county...
         o quizas hasta también la ciudad para que no haya pedos como vez? SIMON*/

        tx.executeSql(
          `SELECT distinct zip FROM addresses where state = '${selectedState}' and city = '${selectedCity}' and county = '${val}'`,
          [],
          (t, res) => {
            const {rows} = res;

            for (let i = 0; i < rows.length; i++) {
              console.log(rows.item(i));
            }
          },
          errorCB,
        );
      }),
    );
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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView styles={styles.container}>
        <Text>Downloading data {Math.round(percent * 100)}</Text>
        <Select data={states} onSelected={_handleStateChange} />
        <Select data={cities} onSelected={_handleCitiesChange} />
        <Select data={county} onSelected={_handleCountyChange} />
        <TextInput
          style={styles.textInput}
          placeholder="Zip"
          placeholderTextColor="silver"
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
  textInput: {
    borderWidth: 1,
    borderColor: '#acacac',
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    marginTop: 7,
  },
});

export default App;
