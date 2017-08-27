const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = admin.initializeApp(functions.config().firebase);

// exports.rekomendasiWarung = functions.https.onRequest((req, res) => {
//   if (req.method !== 'POST') {
//     const status = {
//       "error": {
//         "code": 401,
//         "message": "Authentication failed, use AJEGLI APP to access the data.",
//         "status": "UNAUTHENTICATED"
//       }
//     };
//     res.status(401).send(status);
//   }

//   firebase.database().ref('/warung').once('value', (snap) => res.status(200).send(JSON.stringify(snap.val())));
// });

/**
 * Block Function : set new dummy rating -1 (not counting)
 */
exports.createRatingNewUser = functions.auth.user().onCreate(user => {
  // TODO: 10/07/2017 Reroet -> get uid -> get all key warung at rating path -> set data at multiple path
  const data = { [user.data.uid]: { rating: -1, review: '', } };

  // Rating Warung
  const ratingWarungRef = firebase.database().ref('rating/warung');
  const ratingWarung = ratingWarungRef.once('value', snapshot => {
    let updateObj = {};
    snapshot.forEach(child => { updateObj[child.key] = Object.assign({}, child.val(), data); });
    return ratingWarungRef.update(updateObj)
      .then(() => console.log(`rating warung -1 berhasil ditambah user baru -> ${user.data.uid}`))
      .catch(err => console.log(err));
  });

  // Rating Makanan
  const ratingMakananRef = firebase.database().ref('rating/makanan');
  const ratingMakanan = ratingMakananRef.once('value', snapshot => {
    let updateObj = {};
    snapshot.forEach(child => { updateObj[child.key] = Object.assign({}, child.val(), data); });
    return ratingMakananRef.update(updateObj)
      .then(() => console.log(`rating makanan -1 berhasil ditambah user baru -> ${user.data.uid}`))
      .catch(err => console.log(err));
  });

  return Promise.all([ratingWarungRef, ratingMakananRef]);
});

exports.createRatingWarungNew = functions.database.ref('warung/{idWarung}').onCreate(event => {
  const key = event.params.idWarung;
  return firebase.database().ref('users').once('value', snapshot => {
    const objWrite = {};
    snapshot.forEach(child => { objWrite[child.key] = { rating: -1, review: '', }; });
    console.log(objWrite);
    return firebase.database().ref(`rating/warung/${key}`).update(objWrite);
  });
});

exports.createRatingMakananNew = functions.database.ref('makanan/{idMakanan}').onCreate(event => {
  const key = event.params.idMakanan;
  return firebase.database().ref('users').once('value', snapshot => {
    const objWrite = {};
    snapshot.forEach(child => { objWrite[child.key] = { rating: -1, review: '', }; });
    console.log(objWrite);
    return firebase.database().ref(`rating/makanan/${key}`).update(objWrite);
  });
});

exports.averageRatingWarung = functions.database.ref('rating/warung/{idWarung}/{uid}').onUpdate(event => {
  const idWarung = event.params.idWarung;
  const uid = event.params.uid;

  
});