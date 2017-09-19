import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export default admin.initializeApp(functions.config().firebase);
