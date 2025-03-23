// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGpP4D9KxqqsxbQ14ZZefBV_86CFSQXOg",
  authDomain: "tennisinfo-3aa64.firebaseapp.com",
  projectId: "tennisinfo-3aa64",
  storageBucket: "tennisinfo-3aa64.firebasestorage.app",
  messagingSenderId: "170370847309",
  appId: "1:170370847309:web:5be314a9d358b0af21c204",
  measurementId: "G-TK6Q9SB7FR"
}
// firebaseConfig 정보로 firebase 시작
const app = initializeApp(firebaseConfig)

// firebase의 firestore 인스턴스를 변수에 저장
export const db = getFirestore(app)