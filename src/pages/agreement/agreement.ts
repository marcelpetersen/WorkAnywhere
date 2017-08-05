import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-agreement',
  templateUrl: 'agreement.html',
})
export class AgreementPage {
  public eula: boolean = false;
  constructor(private storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    storage.get('accept_eula').then((val) => {
      if (val) {
        this.eula = true;
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      }
    });
  }
  agree() {
    this.storage.set('accept_eula', true);
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AgreementPage');
  }

}
