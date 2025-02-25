import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FloatingTabComponent } from './floating-tab/floating-tab.component';
@NgModule({
  declarations: [AppComponent,FloatingTabComponent],
  exports: [
    FloatingTabComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() =>
      initializeApp({
        projectId: "transitoapp2025",
        appId: "1:891797453901:web:21e409c356ef3ae8f2f004",
        storageBucket: "transitoapp2025.firebasestorage.app",
        apiKey: "AIzaSyDEOdp2xV41hW7B4PxKy2wVkGhAqQIbnFY",
        authDomain: "transitoapp2025.firebaseapp.com",
        messagingSenderId: "891797453901",
        measurementId: "G-YCTVC6S0PZ"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
