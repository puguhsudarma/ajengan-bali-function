import * as functions from 'firebase-functions';
import * as geolib from 'geolib';
import * as _ from 'lodash';
import firebase from './firebaseAdmin';

require('babel-polyfill');

export const rekomendasiWarung = functions.https.onRequest(async (request, response) => {
  try {
    // const idToken = request.get('Authorization');
    // const decodedToken = await firebase.auth().verifyIdToken(idToken);
    // console.log(decodedToken.uid);

    // const latUser = request.body.lat;
    // const lngUser = request.body.lng;
    const data = [];
    console.log(request.body);

    const snap = await firebase.database().ref('/warung').once('value');
    snap.forEach((snapChild) => {
      const valChild = snapChild.val();

      // const distance = geolib.getDistanceSimple({ latitude: latUser, longitude: lngUser },
      //   { latitude: valChild.lat, longitude: valChild.lng });
      // console.log(distance);

      data.push({
        ...valChild,
        // jarak: distance / 1000,
        key: snapChild.key,
      });
    });
    console.log(data);
    // _.sortBy(data, 'distance');
    response.status(200).send(data);
  } catch (err) {
    console.log(err);
    const res = {
      status: 500,
      code: err.code,
      message: err.message,
    };
    response.status(500).send(res);
  }
});

export const rekomendasiMakanan = functions.https.onRequest(async (request, response) => {
  try {
    // const idToken = request.get('Authorization');
    // const decodedToken = await firebase.auth().verifyIdToken(idToken);
    // console.log(decodedToken.uid);

    // const latUser = request.body.lat;
    // const lngUser = request.body.lng;
    const data = [];
    console.log(request.body);

    const snap = await firebase.database().ref('/makanan').once('value');
    snap.forEach((snapChild) => {
      const valChild = snapChild.val();

      // const distance = geolib.getDistanceSimple({ latitude: latUser, longitude: lngUser },
      //   { latitude: valChild.lat, longitude: valChild.lng });
      // console.log(distance);

      data.push({
        ...valChild,
        // jarak: distance / 1000,
        key: snapChild.key,
      });
    });
    console.log(data);
    // _.sortBy(data, 'distance');
    response.status(200).send(data);
  } catch (err) {
    console.log(err);
    const res = {
      status: 500,
      code: err.code,
      message: err.message,
    };
    response.status(500).send(res);
  }
});
