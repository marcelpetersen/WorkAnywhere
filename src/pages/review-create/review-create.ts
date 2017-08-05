import { Component } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';
import { LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { Events } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
import { ReviewPage } from '../review/review';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-review-create',
  templateUrl: 'review-create.html',
})
export class ReviewCreatePage {
  public userId: string = "";
  public currentLoggedIn: boolean = false;
  public powerRating: number = 0;
  public valueRating: number = 0;
  public wifiRating: number = 0;
  public comments: string = "";
  public placeId: string = "";

  constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, private db: AngularFireDatabase, private userProvider: UserProvider, public platform: Platform, private toast: Toast, public network: Network, public statusBar: StatusBar, private eventCtrl: Events, public splashScreen: SplashScreen, public afAuth: AngularFireAuth, public loading: LoadingController, private fb: Facebook) {
    this.currentLoggedIn = userProvider.getAuthStatus();
    this.userId = userProvider.getUserId();
    this.placeId = this.navParams.get('placeId');
  }

  backClick() {
    this.navCtrl.pop();
  }

  postReview() {
    var itsNow = new Date().getTime();
    var newItem =
      {
        comments: this.comments,
        power: this.powerRating,
        value: this.valueRating,
        wifi: this.wifiRating,
        user_id: this.userId,
        place_id: this.placeId,
        date_created: itsNow
      };
    let loading = this.loading.create({ content: "Posting review..." });
    loading.present();
    const items = this.db.list('/reviews');
    //items.push();
        let that = this;
    items.push(newItem).then((item) => {

      loading.dismiss();
      that.navCtrl.pop();
    });

  }

  loginFacebook() {
    let that = this;
    this.userProvider.LoginViaFacebook().then(result => {
      that.userId = result.user_id;
      //that.myName = result.name;
      //that.userImageUrl = "https://graph.facebook.com/" + result.facebook_id + "/picture?type=large";
      that.currentLoggedIn = result.success;
    });
  }

  onModelChange() {

  }

}
