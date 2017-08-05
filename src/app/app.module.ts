import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ReviewPage } from '../pages/review/review';
import { ReviewCreatePage } from '../pages/review-create/review-create';
import { AgreementPage } from '../pages/agreement/agreement';
// Import the AF2 Module
import { HttpModule } from '@angular/http';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Toast } from '@ionic-native/toast';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglemapProvider } from '../providers/googlemap/googlemap';
import { ReviewProvider } from '../providers/review/review';
import { NetworkProvider } from '../providers/network/network';
import { CallNumber } from '@ionic-native/call-number';
import { UserProvider } from '../providers/user/user';
import { FacebookProvider } from '../providers/facebook/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { Dialogs } from '@ionic-native/dialogs';

var firebaseConfig = {
  apiKey: "AIzaSyD8YD5yUybT_AZ_60B1f2afxE1GNSwVbPI",
  authDomain: "workanywhere-289c5.firebaseapp.com",
  databaseURL: "https://workanywhere-289c5.firebaseio.com",
  projectId: "workanywhere-289c5",
  storageBucket: "workanywhere-289c5.appspot.com",
  messagingSenderId: "28327070537"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ReviewPage,
    ReviewCreatePage,
    AgreementPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    Ionic2RatingModule ,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ReviewPage,
    ReviewCreatePage,
    AgreementPage
  ],
  providers: [
    Facebook,
    StatusBar,
    SplashScreen,
    Toast,
    Network,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GooglemapProvider,
    ReviewProvider,
    NetworkProvider,
    CallNumber,
    UserProvider,
    FacebookProvider,
    Dialogs
  ]
})
export class AppModule { }
