import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ReviewProvider {

  items: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    console.log('Hello ReviewProvider Provider');
  }

  GetReviewSummary(place_id: string): Promise<any> {
    return new Promise((resolve) => {
      /*let retVal = this.db.list('/reviews',
        {
          query: {
            orderByChild: 'place_id',
            equalTo: place_id
          }
        });*/
      let retVal = this.db.list('/reviews');
      debugger;
      resolve(retVal);
    });
  }
}
