import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as geolib from 'geolib';
import * as _ from 'lodash';

const firebase = admin.initializeApp(functions.config().firebase);

export const rekomendasiWarung = functions.https.onRequest((request, response) => {
  const idToken = request.get('Authorization');
  return firebase.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      console.log(decodedToken.uid);
      const latUser = request.body.lat;
      const lngUser = request.body.lng;

      return firebase.database().ref('/warung').once('value', (snap) => {
        const data = [];
        snap.forEach((snapChild) => {
          const valChild = snapChild.val();
          const distance = geolib.getDistance(
            {
              latitude: latUser,
              longitude: lngUser,
            },
            {
              latitude: valChild.lat,
              longitude: valChild.lng,
            },
          );

          data.push(Object.assign(
            {},
            valChild,
            { distance: distance / 1000, key: snapChild.key },
          ));
        });
        _.sortBy(data, 'distance');
        response.status(200).send(data);
      });
    })
    .catch((err) => {
      console.log(err);
      response.status(401).send(err);
    });
});

export const rekomendasiMakanan = functions.https.onRequest((request, response) => {
  const idToken = request.get('Authorization');
  return firebase.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      console.log(decodedToken.uid);
      const latUser = request.body.lat;
      const lngUser = request.body.lng;

      return firebase.database().ref('/makanan').once('value', (snap) => {
        const data = [];
        snap.forEach((snapChild) => {
          const valChild = snapChild.val();
          // join table
          firebase.database().ref(`/warung/${valChild.warungId}`)
            .once('value', (snapJoin) => {
              const valJoin = snapJoin.val();
              const distance = geolib.getDistance(
                {
                  latitude: latUser,
                  longitude: lngUser,
                },
                {
                  latitude: valJoin.lat,
                  longitude: valJoin.lng,
                },
              );
              data.push(Object.assign(
                {},
                valChild,
                { distance: distance / 1000, key: snapChild.key },
              ));
            });
        });
        _.sortBy(data, 'distance');
        response.status(200).send(data);
      });
    })
    .catch((err) => {
      console.log(err);
      response.status(401).send(err);
    });
});
