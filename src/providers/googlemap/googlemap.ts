import { Injectable, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Injectable()
export class GooglemapProvider {

  public currentLocation: any;
  public map: any;
  public infowindow: any;
  public locationsResult: any[] = [];

  constructor(private geolocation: Geolocation) {

  }

  GetPhoneNumber(place_id: string): Promise<string> {
    return new Promise((resolve) => {
      let service = new google.maps.places.PlacesService(this.map);
      service.getDetails({
        placeId: place_id
      }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place.formatted_phone_number);
        }
      });
    });
  }

  GetNearbyCafes(mapElement: ElementRef): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy: true, maximumAge: 75000 }).then((resp) => {
        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.currentLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
        var request = {
          location: latLng,
          types: ['cafe'],
          rankBy: google.maps.places.RankBy.DISTANCE
        };
        this.infowindow = new google.maps.InfoWindow();
        let service = new google.maps.places.PlacesService(this.map);
        let that = this;
        service.nearbySearch(request, function (results, status) {
          let i: number = 0;
          for (let place of results) {
            var marker = new google.maps.Marker({
              map: that.map,
              position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function () {

              that.infowindow.setContent(place.name);
              that.infowindow.open(that.map, marker);
            });
            var distance = that.getDistanceFromLatLonInM(that.currentLocation.lat(), that.currentLocation.lng(), place.geometry.location.lat(), place.geometry.location.lng());
            if (distance > 1000) {
              var km = distance / 1000;
              place.distanceText = km.toFixed(2) + " km";
            }
            else {
              place.distanceText = Math.round(distance) + " m";
            }
            place.internalId = i;
            that.locationsResult.push(place);
            i++;
          }
          resolve(that.locationsResult);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

}
