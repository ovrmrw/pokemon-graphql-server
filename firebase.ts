import * as firebase from 'firebase';
import * as path from 'path';


const root = path.resolve();
const jsonPath = path.join(root, 'secret.json');
console.log('jsonPath:', jsonPath);

const firebaseApp = firebase.initializeApp({
  serviceAccount: jsonPath,
  databaseURL: "https://graphql-e5abf.firebaseio.com",
  databaseAuthVariableOverride: {
    // uid: "my-service-worker"
    uid: '123'
  }
});

export { firebaseApp };