import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Firebase
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

let firebaseConfig;

if (environment.flag == 'KD') {
  firebaseConfig = {
    apiKey: "AIzaSyCJ6fpY0Qy-ZZJ0eLyWWVN1Bg9mU10dDcY",
    authDomain: "econtract-f1d19.firebaseapp.com",
    projectId: "econtract-f1d19",
    storageBucket: "econtract-f1d19.firebasestorage.app",
    messagingSenderId: "275368630162",
    appId: "1:275368630162:web:099eb2477c044ebe77534b",
    measurementId: "G-VRCNNGZC1M"
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyCJ6fpY0Qy-ZZJ0eLyWWVN1Bg9mU10dDcY",
    authDomain: "econtract-f1d19.firebaseapp.com",
    projectId: "econtract-f1d19",
    storageBucket: "econtract-f1d19.firebasestorage.app",
    messagingSenderId: "275368630162",
    appId: "1:275368630162:web:099eb2477c044ebe77534b",
    measurementId: "G-VRCNNGZC1M"
  };
}

const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);

if (!environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
