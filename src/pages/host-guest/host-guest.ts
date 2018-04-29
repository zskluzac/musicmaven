import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController } from 'ionic-angular';
import { GuestPage } from '../guest/guest';
import { HostSongListPage } from "../host-song-list/host-song-list";
import { HowtoPage } from '../howto/howto';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

/**
 * The home page. User can select to be a host or a guest.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-host-guest',
  templateUrl: 'host-guest.html',
})
export class HostGuestPage {
  HostButton: any;
  GuestButton: any;
  HowtoButton: any;
  public id: string;
  roomList: AngularFireList<any>;
  rooms: Observable<any[]>;
  idList: Array<String>;
  found: number = -1;

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public alertCtrl: AlertController,
    public fBProvider: FirebaseProvider,
    private sDProvider: SessionDataProvider) {
      this.HostButton = HostSongListPage;
      this.GuestButton = GuestPage;
      this.HowtoButton = HowtoPage;
      this.roomList = this.afDB.list('/rooms');
      this.rooms = this.roomList.valueChanges();
      this.idList = new Array<String>(2);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HostGuestPage');
    console.log('  __  __           _           \n' +
      ' |  \\/  |_   _ ___(_) ___      \n' +
      ' | |\\/| | | | / __| |/ __|     \n' +
      ' | |  | | |_| \\__ \\ | (__      \n' +
      ' |_|  |_|\\__,_|___/_|\\___|     \n' +
      '  __  __                       \n' +
      ' |  \\/  | __ ___   _____ _ __  \n' +
      ' | |\\/| |/ _` \\ \\ / / _ \\ \'_ \\ \n' +
      ' | |  | | (_| |\\ V /  __/ | | |\n' +
      ' |_|  |_|\\__,_| \\_/ \\___|_| |_|\n' +
      '                                       ');
  }

  /**
   * Generate an alphanumeric string of length 5 to be used as a room code.
   * @returns {string}
   */
  makeId() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    //TODO: make the length a constant to avoid hardcoding
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  /**
   * Use the room code generated by makeId() to make a room in the Firebase and then takes
   * the user to the generated room.
   */
  makeRoomAndEnter() {
    this.id = this.makeId();
    this.fBProvider.genRoom(this.id);
    this.sDProvider.setRoomCode(this.id);
    this.sDProvider.setHost(true);
    //Set HostSongPage as root https://stackoverflow.com/questions/37296999/ionic-2-disabling-back-button-for-a-specific-view
    let alert = this.alertCtrl.create({
      title: 'Room  "'+this.id+'" Created',
      message: 'Tell your guests this room code! Enjoy the party.',
      buttons: ["OK"]
    });
    alert.present();
    this.navCtrl.insert(0, HostSongListPage, {roomId: this.id}).then(() => {
      this.navCtrl.popToRoot();
    });
  }

}
