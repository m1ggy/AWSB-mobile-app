import {auth} from 'firebase/auth';
import * as firebase from 'firebase';
import {firebaseConfig} from './keys/firebaseConfig';


//configure firebase
const app = firebase.initializeApp(firebaseConfig)

export const auth = app.auth()

export default app