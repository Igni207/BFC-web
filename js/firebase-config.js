// =========================================================
// FIREBASE — config del proyecto (Firestore para sincronizar
// la Tabla y los Brackets en tiempo real entre navegadores)
//
// SI QUERÉS USAR TU PROPIO PROYECTO DE FIREBASE:
// 1. https://console.firebase.google.com > creá un proyecto (gratis)
// 2. Build > Firestore Database > Crear base de datos
// 3. En Reglas, por ahora (uso privado entre amigos):
//      rules_version = '2';
//      service cloud.firestore {
//        match /databases/{database}/documents {
//          match /{document=**} { allow read, write: if true; }
//        }
//      }
// 4. Configuración del proyecto (tuerca) > Tus apps > Web (</>) > copiá el
//    objeto firebaseConfig y pegalo abajo, reemplazando este.
// =========================================================
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAx-zBmFyfLh8ORoClcozwIahrx222Nipc",
    authDomain: "based-fighting-cup.firebaseapp.com",
    projectId: "based-fighting-cup",
    storageBucket: "based-fighting-cup.firebasestorage.app",
    messagingSenderId: "539560995135",
    appId: "1:539560995135:web:e49e9456db62e3fe278b8a"
  };
