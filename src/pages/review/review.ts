import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { GooglemapProvider } from '../../providers/googlemap/googlemap';
import { CallNumber } from '@ionic-native/call-number';
import { ReviewCreatePage } from '../review-create/review-create';
import { UserProvider } from '../../providers/user/user';
import { Dialogs } from '@ionic-native/dialogs';

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {

  public reviewResults: any[] = [];
  public photoUrl: string;
  public place: any;
  public userId: string;

  constructor(private dialogs: Dialogs, private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private googleMapProvider: GooglemapProvider, public loading: LoadingController, public callNumber: CallNumber) {

    this.place = this.navParams.get('place');
    if (this.place.photos) {
      if (this.place.photos.length > 0) {
        this.photoUrl = this.place.photos[0].getUrl({ 'maxWidth': window.innerWidth, 'maxHeight': 120 });
      }
    }
    let testrestulu = this.db.list('/reviews', {
      query: {
        orderByChild: 'place_id',
        equalTo: this.place.place_id
      }
    });
    let that = this;
    this.reviewResults.length = 0;
    testrestulu.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        that.userProvider.GetFacebookUserId(snapshot.user_id).then(res => {
          snapshot.imageUrl = "https://graph.facebook.com/" + res + "/picture?type=large";

          that.reviewResults.push(snapshot);
        });

      });
      //this.reviewLoading = false;
    });

    this.userId = userProvider.getUserId();
  }

  toggleFavourite() {
    this.dialogs.alert('Hello world');
    /* var items = this.db.list('/favourites');
     var newItem =
       {
         'user_id': this.userId,
         'place_id': this.place.place_id
       };
     items.push(newItem);*/
  }

  getClassName(id: number, rating: number) {
    if (Math.round(rating) < id) {
      return "star-outline";
    }
    else {
      return "star";
    }

  }

  backClick() {
    this.navCtrl.pop();
  }

  postReview() {
    this.navCtrl.push(ReviewCreatePage, { placeId: this.place.place_id });
  }

  directionsClick() {
    let placeName = encodeURIComponent(this.place.name + " " + this.place.vicinity);
    let url = "https://maps.google.com?saddr=Current+Location&daddr=" + placeName;
    window.open(url, "_system");
  }

  callClick() {
    let loading = this.loading.create({ content: "Calling..." });
    this.googleMapProvider.GetPhoneNumber(this.place.place_id).then(res => {
      loading.dismissAll();
      this.callNumber.callNumber(res, true)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));

    });
  }

  ionViewDidLoad() {

  }

}
