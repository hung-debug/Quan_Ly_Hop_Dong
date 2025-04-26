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
    apiKey: "AIzaSyBEX4QbtiOdkdLc2jgCRMNZF_H_BuVq_CM",
    authDomain: "econtract-f1d19.firebaseapp.com",
    projectId: "econtract-f1d19",
    storageBucket: "econtract-f1d19.firebasestorage.app",
    messagingSenderId: "275368630162",
    appId: "1:275368630162:web:e5d174fb9821018677534b",
    measurementId: "G-FX0NLN13RT"
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyBEX4QbtiOdkdLc2jgCRMNZF_H_BuVq_CM",
    authDomain: "econtract-f1d19.firebaseapp.com",
    projectId: "econtract-f1d19",
    storageBucket: "econtract-f1d19.firebasestorage.app",
    messagingSenderId: "275368630162",
    appId: "1:275368630162:web:b3b01d5899d677f477534b",
    measurementId: "G-2WKE95VE4G"
  };
}

const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);

if (!environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
