import { Component, Renderer, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ReviewPage } from '../review/review';
import { GooglemapProvider } from '../../providers/googlemap/googlemap';
import { ReviewProvider } from '../../providers/review/review';
import { AngularFireDatabase } from 'angularfire2/database';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { ReviewCreatePage } from '../review-create/review-create';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;

  public allowClickFindMe: boolean = true;
  public searchActive: boolean = false;
  public classMapFindMe = { 'findmebutton': true, 'findmebuttonanim': false };
  map: any;
  infowindow: any;
  public locationsResult: any[] = [];
  public currentSelectedresult: number = -1;
  public currentLocation: any;
  public showError: boolean = false;
  public errorText: string;
  public retVal: any[] = [];

  public reviewLoading: boolean = false;

  public power: number = 0;
  public wifi: number = 0;
  public money: number = 0;

  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    private render: Renderer,
    private googleMapProvider: GooglemapProvider,
    private reviewProvider: ReviewProvider,
    private db: AngularFireDatabase,
    public changeDetectorRef: ChangeDetectorRef,
    public toast: Toast,
    public network: Network) {


  }

  getButtonCaption() {
    if (this.searchActive) {
      return "Searching...";
    }

    if (this.allowClickFindMe) {
      return "Find a cafe!";
    }

    return "Results below";
  }

  findPlacesClick() {
    let that = this;
    this.allowClickFindMe = false;
    this.searchActive = true;
    this.googleMapProvider.GetNearbyCafes(this.mapElement).then(res => {
      this.locationsResult = res;
      this.searchActive = false;
      this.classMapFindMe.findmebuttonanim = true;
      this.changeDetectorRef.detectChanges();
    }).catch(error => {
      this.allowClickFindMe = true;
      this.searchActive = false;
      this.showError = true;
      this.errorText = "We can't seem to find your current location. Please try again in a moment.";
      setTimeout(function () { that.showError = false }, 5000);

    });
  }


  selectResult(id: number) {
    if (this.currentSelectedresult === id) {
      this.currentSelectedresult = -1;
      this.changeDetectorRef.detectChanges();
    }
    else {
      this.reviewLoading = true;
      this.currentSelectedresult = id;
      let place_id = this.locationsResult.filter(x => x.internalId == id)[0];
      this.retVal.length = 0;
      let testrestulu = this.db.list('/reviews', {
        query: {
          orderByChild: 'place_id',
          equalTo: place_id.place_id
        }
      });


      let tempPower = 0;
      let tempMoney = 0;
      let tempWifi = 0;

      testrestulu.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.retVal.push(snapshot);
          tempPower = tempPower + snapshot.power;
          tempMoney = tempMoney + snapshot.value;
          tempWifi = tempWifi + snapshot.wifi;
        });
        var yeahcount = snapshots.length;
        this.locationsResult.filter(x => x.internalId == id)[0].power_value = (tempPower / snapshots.length);
        this.locationsResult.filter(x => x.internalId == id)[0].money_value = (tempMoney / snapshots.length);
        this.locationsResult.filter(x => x.internalId == id)[0].wifi_value = (tempWifi / snapshots.length);
        this.reviewLoading = false;
      });
    }


  }

  getClassName(id: number, rating: number) {
    if (Math.round(rating) < id) {
      return "star-outline";
    }
    else {
      return "star";
    }

  }

  openReview(id: number) {
    this.navCtrl.push(ReviewPage, { place: this.locationsResult.filter(x => x.internalId == id)[0] });
  }

  createReview(id: number) {
    this.navCtrl.push(ReviewCreatePage, { placeId: this.locationsResult.filter(x => x.internalId == id)[0].place_id });
  }

  openGoogleMaps(id: number) {
    let place = this.locationsResult.filter(x => x.internalId == id)[0];
    let placeName = encodeURIComponent(place.name + " " + place.vicinity);
    let url = "https://maps.google.com?saddr=Current+Location&daddr=" + placeName;
    window.open(url, "_system");
  }

}
