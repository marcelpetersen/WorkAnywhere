import { Injectable } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Rx';
import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { Events } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {

    private myValue: boolean;
    private userId: string;
    private userRetVal: UserReturnModel = new UserReturnModel();;

    constructor(private storage: Storage, public loading: LoadingController, public platform: Platform, private db: AngularFireDatabase, public afAuth: AngularFireAuth, private fb: Facebook) { }

    LoginViaFacebook(): Promise<any> {
        return new Promise((resolve) => {
            let that = this;
            if (this.platform.is('mobileweb') || this.platform.is('core')) {
                this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function (response) {

                    that.userRetVal.facebook_id = response.additionalUserInfo.profile.id;
                    that.userRetVal.name = response.additionalUserInfo.profile.name;
                    that.storage.set('accessToken', response.credential.accessToken);

                    that.afAuth.authState.subscribe(user => {
                        if (user) {
                            that.userRetVal.id = user.uid;
                            that.setAuthStatus(true);
                            that.setUserId(user.uid);
                            var retVal =
                                {
                                    'facebook_id': response.additionalUserInfo.profile.id,
                                    'name': response.additionalUserInfo.profile.name,
                                    'user_id': user.uid,
                                    'success': true
                                };
                            let facebookUserSubscription = that.db.list('/users', {
                                query: {
                                    orderByChild: 'user_id',
                                    equalTo: user.uid
                                }
                            });
                            facebookUserSubscription.subscribe(snapshots => {
                                let fbUsers: any[] = [];
                                if (snapshots.length === 0) {
                                    var items = that.db.list('/users');
                                    var newUser =
                                        {
                                            'user_id': user.uid,
                                            'facebook_id': response.additionalUserInfo.profile.id
                                        };
                                    items.push(newUser);
                                }

                            });
                            resolve(retVal);
                            //loading.dismiss();
                            return;
                        } else {
                            that.setAuthStatus(false);
                        }
                    });
                }, function (error) {

                });
            }
            else {
                let permissions = new Array();

                permissions = ["public_profile", "email", "public_profile"];
                this.fb.login(permissions).then(function (response) {
                    that.storage.set('accessToken', response.authResponse.accessToken);
                    let creds = (firebase.auth.FacebookAuthProvider as any).credential(response.authResponse.accessToken);
                    that.afAuth.auth.signInWithCredential(creds);
                    that.afAuth.authState.subscribe(user => {
                        if (user) {

                            that.userRetVal.id = user.uid;
                            that.setAuthStatus(true);
                            that.setUserId(user.uid);
                            var retVal =
                                {
                                    'facebook_id': response.authResponse.userID,
                                    'name': user.displayName,
                                    'user_id': user.uid,
                                    'success': true
                                };
                            let facebookUserSubscription = that.db.list('/users', {
                                query: {
                                    orderByChild: 'user_id',
                                    equalTo: user.uid
                                }
                            });
                            facebookUserSubscription.subscribe(snapshots => {
                                if (snapshots.length === 0) {
                                    var items = that.db.list('/users');
                                    var newUser =
                                        {
                                            'user_id': user.uid,
                                            'facebook_id': response.authResponse.userID
                                        };
                                    items.push(newUser);
                                }
                            });
                            resolve(retVal);
                            // loading.dismiss();
                            return;
                        } else {
                            that.setAuthStatus(false);
                        }
                    });
                }, function (error) {

                });
            }
        });
    }

    GetFacebookUserId(user_id: string): Promise<string> {
        return new Promise((resolve) => {
            let that = this;
            let facebookUserSubscription = that.db.list('/users', {
                query: {
                    orderByChild: 'user_id',
                    equalTo: user_id
                }
            });
            facebookUserSubscription.subscribe(snapshots => {
                resolve(snapshots[0].facebook_id);
                return;
            });

        });
    }

    LoginWithAccessToken(accessToken: string): Promise<any> {
        return new Promise((resolve) => {
            let that = this;
            let creds = (firebase.auth.FacebookAuthProvider as any).credential(accessToken);
            that.afAuth.auth.signInWithCredential(creds).then(result => {
                var facebook_id = result.providerData["0"].uid;
                that.userRetVal.id = result.uid;
                that.setAuthStatus(true);
                that.setUserId(result.uid);
                var retVal =
                    {
                        'facebook_id': facebook_id,
                        'name': result.displayName,
                        'user_id': result.uid,
                        'success': true
                    };

                let facebookUserSubscription = that.db.list('/users', {
                    query: {
                        orderByChild: 'user_id',
                        equalTo: result.uid
                    }
                });
                facebookUserSubscription.subscribe(snapshots => {
                    if (snapshots.length === 0) {
                        var items = that.db.list('/users');
                        var newUser =
                            {
                                'user_id': result.uid,
                                'facebook_id': facebook_id
                            };
                        items.push(newUser);
                    }
                });
                resolve(retVal);
                return;
            }).catch(result => {
                that.setAuthStatus(false);
                var retVal =
                    {
                        'success': false
                    };
                resolve(retVal);
                return;
            });

        });
    }

    setAuthStatus(val: boolean) {

        this.myValue = val;
    }

    getAuthStatus() {
        return this.myValue;
    }

    setUserId(input: string) {
        this.userId = input;
    }

    getUserId() {
        return this.userId;
    }

}


export class UserReturnModel {
    public success: boolean;
    public id: string;
    public facebook_id: string;
    public name: string;

    getPhotoUrl(): string {
        return "https://graph.facebook.com/" + this.facebook_id + "/picture?type=large";
    }
}