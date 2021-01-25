import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import ActionBar from './ActionBar';
import AddBirthday from './AddBirthday';
import firebase from '../utils/firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebase);

export default function ListBirthday(props) {
  const {user} = props;
  const [showList, setShowList] = useState(true);
  const [birthday, setBirthday] = useState([]);
  const [pasatBirthday, setPasatBirthday] = useState([]);

  useEffect(() => {
    setBirthday([]);
    db.collection(user.uid)
      .orderBy('dateBirth', 'asc')
      .get()
      .then((response) => {
        const itemsArray = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          itemsArray.push(data);
        });
        formData(itemsArray);
      });
  }, []);

  const formData = (items) => {
    //Obtención de la fecha del día
    const currentDate = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const birthdayTempArray = [];
    const pasatBirthdayTempArray = [];

    items.forEach((item) => {
      //Iteramos todas las fechas que recibimos de la base de datos
      const dateBirth = new Date(item.dateBirth.seconds * 1000);
      const dateBirthday = moment(dateBirth);
      const currentYear = moment().get('year');
      dateBirthday.set({year: currentYear}); //formateo de fechas

      const diffDate = currentDate.diff(dateBirthday, 'days'); //Diferencia entre los días con el actual.
      const itemTemp = item;
      itemTemp.dateBirth = dateBirthday;
      itemTemp.days = diffDate;

      if (diffDate <= 0) {
        //Comparación de fechas
        birthdayTempArray.push(itemTemp);
      } else {
        pasatBirthdayTempArray.push(itemTemp);
      }
    });
    console.log('Estos son los próximos cumpleaños ', birthdayTempArray);
    console.log('Estos son los cumpleaños pasados ', pasatBirthdayTempArray);
    setBirthday(birthdayTempArray);
    setPasatBirthday(pasatBirthdayTempArray);
  };

  return (
    <View style={styles.container}>
      {showList ? (
        <>
          <Text>List</Text>
          <Text>List</Text>
          <Text>List</Text>
          <Text>List</Text>
          <Text>List</Text>
        </>
      ) : (
        <AddBirthday user={user} setShowList={setShowList} />
      )}
      <ActionBar setShowList={setShowList} showList={showList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
  },
});
