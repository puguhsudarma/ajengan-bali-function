import { database, auth } from 'firebase-functions';
import firebase from '../config/firebaseAdmin';

/**
 * Menambah node user baru pada masing - masing rating warung dan makanan
 */
export const createRatingNewUser = auth.user().onCreate((user) => {
  const { uid } = user.data;
  const data = { [uid]: { rating: -1, review: '' } };

  // Rating Warung
  const ratingWarungRef = firebase.database().ref('rating/warung');
  const ratingWarung = ratingWarungRef.once('value')
    .then((snapshot) => {
      const updateObjWarung = {};
      snapshot.forEach((child) => {
        updateObjWarung[child.key] = {
          ...child.val(),
          ...data,
        };
      });
      return ratingWarungRef.update(updateObjWarung);
    });

  // Rating Makanan
  const ratingMakananRef = firebase.database().ref('rating/makanan');
  const ratingMakanan = ratingMakananRef.once('value')
    .then((snapshot) => {
      const updateObjMakanan = {};
      snapshot.forEach((child) => {
        updateObjMakanan[child.key] = {
          ...child.val(),
          ...data,
        };
      });
      return ratingMakananRef.update(updateObjMakanan);
    });

  // return promise to wait function until terminate
  return Promise.all([ratingWarung, ratingMakanan])
    .then(() => {
      console.log(`init rating warung -1 user -> ${uid}`);
      console.log(`init rating makanan -1 user -> ${uid}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Menambah node key warung baru pada rating
 */
export const createRatingWarungNew = database.ref('warung/{idWarung}').onCreate((event) => {
  const key = event.params.idWarung;

  return firebase.database().ref('users').once('value')
    .then((snapshot) => {
      const objWrite = {};
      snapshot.forEach((child) => {
        objWrite[child.key] = {
          rating: -1,
          review: '',
        };
      });

      return firebase.database().ref(`rating/warung/${key}`).update(objWrite);
    })
    .then(() => {
      console.log(`rating -1 baru pada warung -> ${key}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Menambah node key makanan baru pada rating
 */
export const createRatingMakananNew = database.ref('makanan/{idMakanan}').onCreate((event) => {
  const key = event.params.idMakanan;

  return firebase.database().ref('users').once('value')
    .then((snapshot) => {
      const objWrite = {};
      snapshot.forEach((child) => {
        objWrite[child.key] = {
          rating: -1,
          review: '',
        };
      });

      return firebase.database().ref(`rating/makanan/${key}`).update(objWrite);
    })
    .then(() => {
      console.log(`rating -1 baru pada makanan -> ${key}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Menghitung rata - rata rating warung saat ada rating baru masuk
 */
export const avgRatingWarung = database.ref('rating/warung/{idWarung}/{uid}/rating').onUpdate((event) => {
  const { idWarung } = event.params;
  const initRating = -1;
  let sum = 0;
  let count = 0;

  return firebase.database().ref(`rating/warung/${idWarung}`).once('value')
    .then((deltaSnapshot) => {
      deltaSnapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.rating > initRating) {
          sum += childData.rating;
          count += 1;
        }
      });
      const avg = sum / count;
      const update = firebase.database().ref(`warung/${idWarung}`).update({ totalRating: avg });

      return Promise.all([avg, update]);
    })
    .then((resp) => {
      console.log(`new avg rating warung -> ${idWarung} = ${resp[0]}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Menghitung rata - rata rating makanan saat ada rating baru masuk
 */
export const avgRatingMakanan = database.ref('rating/makanan/{idMakanan}/{uid}/rating').onUpdate((event) => {
  const { idMakanan } = event.params;
  const initRating = -1;
  let sum = 0;
  let count = 0;

  return firebase.database().ref(`rating/makanan/${idMakanan}`).once('value')
    .then((deltaSnapshot) => {
      deltaSnapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.rating > initRating) {
          sum += childData.rating;
          count += 1;
        }
      });
      const avg = sum / count;
      const update = firebase.database().ref(`makanan/${idMakanan}`).update({ totalRating: avg });
      return Promise.all([avg, update]);
    })
    .then((resp) => {
      console.log(`new avg rating makanan -> ${idMakanan} = ${resp[0]}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
