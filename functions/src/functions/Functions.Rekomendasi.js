import { https } from 'firebase-functions';
import { sortBy } from 'lodash';
import { transpose } from 'mathjs';
import firebase from '../config/firebaseAdmin';
import getDistance from '../config/distance';
import algoritma from '../algoritma';

/**
 * Fungsi untuk menghitung nilai rekomendasi dan return hasil item warung rekomendasi
 */
export const rekomendasiWarung = https.onRequest((request, response) => {
  // get all request
  const userCoord = {
    lat: request.body.lat,
    lng: request.body.lng,
  };
  const { uid } = request.body;

  // declare variabel
  const item = [];
  const kontenItem = [];
  const rating = [];
  let countIndexUID = 0;
  let notFoundUID = true;

  // get data from firebase realtime database
  const snapshotKonten = firebase.database().ref('warung').once('value');
  const snapshotRating = firebase.database().ref('rating/warung').once('value');

  // return promise to execute until terminate
  return Promise.all([snapshotKonten, snapshotRating])
    .then((deltaSnapshot) => {
      // konten item warung
      deltaSnapshot[0].forEach((snapChild) => {
        const data = snapChild.val();
        const { key } = snapChild;
        const km = getDistance(userCoord.lat, userCoord.lng, data.lat, data.lng);
        kontenItem.push([
          km,
          data.totalRating,
        ]);
        item.push({
          key,
          km,
          ...data,
        });
      });

      // rating warung
      deltaSnapshot[1].forEach((snapChildItem) => {
        const rowRating = [];
        snapChildItem.forEach((snapChildUser) => {
          // Get index UID
          if (snapChildUser.key !== uid && notFoundUID) {
            countIndexUID += 1;
          }
          if (snapChildUser.key === uid) {
            notFoundUID = false;
          }

          // Get rating
          const data = snapChildUser.val();
          if (data.rating === -1) {
            data.rating = 0;
          }
          rowRating.push(data.rating);
        });
        rating.push(rowRating);
      });
      const transposeRating = transpose(rating);

      // algoritma
      const hasil = algoritma(transposeRating, kontenItem, countIndexUID);
      item.forEach((row, index) => {
        item[index] = {
          ...item[index],
          nilaiRekomendasi: hasil[index],
        };
      });

      // result
      sortBy(item, 'nilaiRekomendasi');
      console.log(item);
      response.status(200).send(item);
    })
    .catch((err) => {
      // error
      console.log('Rekomendasi warung error: ', err);
    });
});

/**
 * Fungsi untuk menghitung nilai rekomendasi dan return hasil item makanan rekomendasi
 */
export const rekomendasiMakanan = https.onRequest((request, response) => {
  // get all request
  const userCoord = {
    lat: request.body.lat,
    lng: request.body.lng,
  };
  const { uid } = request.body;

  // declare variabel
  const item = [];
  const kontenItem = [];
  const rating = [];
  let countIndexUID = 0;
  let notFoundUID = true;

  // get data from firebase realtime database
  const snapshotKonten = firebase.database().ref('makanan').once('value');
  const snapshotRating = firebase.database().ref('rating/makanan').once('value');
  const snapshotWarung = firebase.database().ref('warung').once('value');

  // return promise to execute until terminate
  return Promise.all([snapshotKonten, snapshotRating, snapshotWarung])
    .then((deltaSnapshot) => {
      // konten item makanan
      const dataWarung = deltaSnapshot[2].val();
      deltaSnapshot[0].forEach((snapChild) => {
        const data = snapChild.val();
        const selectedWarung = dataWarung[data.warungId];
        const { key } = snapChild;
        const km = getDistance(
          userCoord.lat,
          userCoord.lng,
          selectedWarung.lat,
          selectedWarung.lng,
        );
        kontenItem.push([
          km,
          data.harga,
          data.totalRating,
        ]);
        item.push({
          key,
          km,
          ...data,
          warung: { ...selectedWarung },
        });
      });

      // rating makanan
      deltaSnapshot[1].forEach((snapChildItem) => {
        const rowRating = [];
        snapChildItem.forEach((snapChildUser) => {
          // Get index UID
          if (snapChildUser.key !== uid && notFoundUID) {
            countIndexUID += 1;
          }
          if (snapChildUser.key === uid) {
            notFoundUID = false;
          }

          // Get rating
          const data = snapChildUser.val();
          if (data.rating === -1) {
            data.rating = 0;
          }
          rowRating.push(data.rating);
        });
        rating.push(rowRating);
      });
      const transposeRating = transpose(rating);

      // algoritma
      const hasil = algoritma(transposeRating, kontenItem, countIndexUID);
      item.forEach((row, index) => {
        item[index] = {
          ...item[index],
          nilaiRekomendasi: hasil[index],
        };
      });

      // result
      sortBy(item, 'nilaiRekomendasi');
      console.log(item);
      response.status(200).send(item);
    })
    .catch((err) => {
      console.log('Rekomendasi makanan error: ', err);
    });
});
