import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Facebook } from '@ionic-native/facebook';
import { Events } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { UserProvider } from '../providers/user/user';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { AgreementPage } from '../pages/agreement/agreement';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = AgreementPage;

  pages: Array<{ title: string, component: any }>;

  FB_APP_ID: number = 725735420930937;
  public myName: string = "";

  public userImageUrl: string = "assets/images/empty.jpg";
  public currentLoggedIn: boolean = false;

  constructor(private storage: Storage, private http: Http, private userProvider: UserProvider, public platform: Platform, private toast: Toast, public network: Network, public statusBar: StatusBar, private eventCtrl: Events, public splashScreen: SplashScreen, public afAuth: AngularFireAuth, public loading: LoadingController, private fb: Facebook) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
    storage.get('accept_eula').then((val) => {
      /* if (val == null) {
         this.nav.push(AgreementPage);
       }*/
      if (val == null) {
        this.nav.setRoot(AgreementPage);
      } else {
        this.nav.setRoot(HomePage);
      }
    });
    storage.get('accessToken').then((val) => {
      if (val) {
        let that = this;
        this.userProvider.LoginWithAccessToken(val).then(result => {
          if (result.success) {
            that.myName = result.name;
            that.userImageUrl = "https://graph.facebook.com/" + result.facebook_id + "/picture?type=large";
            that.currentLoggedIn = result.success;
          }
        });

      }
    });
  }

  ionviewdidload() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }

  isNullOrWhitespace(input) {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
  }

  loginFacebook() {
    let that = this;
    this.userProvider.LoginViaFacebook().then(result => {
      that.myName = result.name;
      that.userImageUrl = "https://graph.facebook.com/" + result.facebook_id + "/picture?type=large";
      that.currentLoggedIn = result.success;
    });
  }


  logout() {
    this.afAuth.auth.signOut();
    this.myName = "";
    this.userImageUrl = "assets/images/empty.jpg";
    this.currentLoggedIn = false;
    this.userProvider.setAuthStatus(false);
    this.userProvider.setUserId("");
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
