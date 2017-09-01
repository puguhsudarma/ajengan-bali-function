import * as functions from 'firebase-functions';
import firebase from './firebaseAdmin';

export const createRatingNewUser = functions.auth.user().onCreate((user) => {
  const data = { [user.data.uid]: { rating: -1, review: '' } };
  // Rating Warung
  const ratingWarungRef = firebase.database().ref('rating/warung');
  const ratingWarung = ratingWarungRef.once('value', (snapshot) => {
    const updateObj = {};
    snapshot.forEach((child) => { updateObj[child.key] = Object.assign({}, child.val(), data); });
    return ratingWarungRef.update(updateObj)
      .then(() => console.log(`init rating warung -1 user -> ${user.data.uid}`))
      .catch(err => console.log('init rating warung: ', err));
  });
  // Rating Makanan
  const ratingMakananRef = firebase.database().ref('rating/makanan');
  const ratingMakanan = ratingMakananRef.once('value', (snapshot) => {
    const updateObj = {};
    snapshot.forEach((child) => { updateObj[child.key] = Object.assign({}, child.val(), data); });
    return ratingMakananRef.update(updateObj)
      .then(() => console.log(`init rating makanan -1 user -> ${user.data.uid}`))
      .catch(err => console.log('init rating makanan: ', err));
  });
  return Promise.all([ratingWarung, ratingMakanan]);
});

export const createRatingWarungNew = functions.database.ref('warung/{idWarung}').onCreate((event) => {
  const key = event.params.idWarung;
  return firebase.database().ref('users').once('value', (snapshot) => {
    const objWrite = {};
    snapshot.forEach((child) => { objWrite[child.key] = { rating: -1, review: '' }; });
    console.log(objWrite);
    return firebase.database().ref(`rating/warung/${key}`).update(objWrite);
  });
});

export const createRatingMakananNew = functions.database.ref('makanan/{idMakanan}').onCreate((event) => {
  const key = event.params.idMakanan;
  return firebase.database().ref('users').once('value', (snapshot) => {
    const objWrite = {};
    snapshot.forEach((child) => { objWrite[child.key] = { rating: -1, review: '' }; });
    console.log(objWrite);
    return firebase.database().ref(`rating/makanan/${key}`).update(objWrite);
  });
});

// export const avgRatingWarung = functions.database.ref('rating/warung/{idWarung}/{uid}')
//   .onUpdate((event) => {
//     const idWarung = event.params.idWarung;
//     const uid = event.params.uid;
//   });
