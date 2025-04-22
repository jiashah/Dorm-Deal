
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAEx5Xq6pe7TT-T2_ucDFDklpmn_BrWWbE",
  authDomain: "logindormdeal.firebaseapp.com",
  projectId: "logindormdeal",
  storageBucket: "logindormdeal.firebaseapp.com",
  messagingSenderId: "824066337396",
  appId: "1:824066337396:web:2059fed503f4e7f1aa3f21"
};

//start of firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId, color = 'green') {
  console.log(`Showing message in #${divId}: ${message}`);
  const messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.innerText = message;
    messageDiv.style.color = color;
    messageDiv.style.display = 'block';
    messageDiv.style.opacity = '1';
    messageDiv.style.animation = 'none';
    void messageDiv.offsetWidth;
    messageDiv.style.animation = 'fadeOut 7s forwards';
  } else {
    console.warn(` No element with ID '${divId}' found.`);
  }
}

//signup
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { email, firstName, lastName };
      const docRef = doc(db, "users", user.uid);

      setDoc(docRef, userData)
        .then(() => {
          
          signOut(auth)  
            .then(() => {
              document.getElementById('signup').style.display = 'none';
              document.getElementById('signIn').style.display = 'block';

              showMessage(' Account Created Successfully. Please sign in.', 'signInMessage');

              document.getElementById('rEmail').value = '';
              document.getElementById('rPassword').value = '';
              document.getElementById('fName').value = '';
              document.getElementById('lName').value = '';

      
              document.getElementById('signIn').scrollIntoView({ behavior: 'smooth' });
            })
            .catch((signOutError) => {
              console.error("Sign-out Error:", signOutError);
              showMessage(' Account created, but sign-out failed. Please sign in manually.', 'signUpMessage', 'red');
            });
        })
        .catch((error) => {
          console.error("Firestore Error:", error);
          showMessage(' Error saving user data.', 'signUpMessage', 'red');
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessageDiv = 'signUpMessage';

      switch (errorCode) {
        case 'auth/email-already-in-use':
          showMessage(' Email Address Already Exists!', errorMessageDiv, 'red');
          break;
        case 'auth/invalid-email':
          showMessage(' Invalid Email Format', errorMessageDiv, 'red');
          break;
        case 'auth/weak-password':
          showMessage(' Password should be at least 6 characters', errorMessageDiv, 'red');
          break;
        case 'auth/missing-email':
          showMessage(' Email is required', errorMessageDiv, 'red');
          break;
        default:
          showMessage(`${error.message}`, errorMessageDiv, 'red');
          console.error("Signup Error:", error);
      }
    });
});

// Sign In Handler
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      localStorage.setItem('loggedInUserId', user.uid);
      localStorage.setItem('loginSuccess', 'true');

      showMessage('Login is successful', 'signInMessage');

      window.location.href = './index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessageDiv = 'signInMessage';

      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', errorMessageDiv, 'red');
      } else {
        showMessage('Account does not exist', errorMessageDiv, 'red');
      }

      console.error("Login Error:", error);
    });
});