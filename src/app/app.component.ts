import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {Subject} from 'rxjs';
import {MainServiceService} from "./main-service.service";
import { HttpClient } from '@angular/common/http';
import { Media,MediaObject } from '@ionic-native/media/ngx';
import {Howl, Howler} from 'howler';
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private http: HttpClient,
    private media: Media,
    public service: MainServiceService,

  ) {
    setInterval(() => { 
      this.update_checkpoint();
    }, 5000);
    this.router.events.subscribe((val)=>{this.hidePlayerFooter()});
    this.initializeApp();
  }

  private sound = new Howl({
    html5:true,
    buffer:true,
    withCredentials:true,
    src: [null]
  });
  private album = [];
  private track_id = null;
  private jwt: string;
  private valid_profile: boolean = false;

  hidePlayerFooter(){
    if(this.router.url == "/musicplayer"){
      if(this.service.getLoaded() == false){
        var album = this.service.getAlbum().getValue();
        this.service.changeAlbum(album);
      }
      document.getElementById("player-footer").style.display = "none";
      document.getElementById("tab-barz").style.display = "none";
    }
    else if( this.router.url == "/login"){
      document.getElementById("player-footer").style.display = "none";
      document.getElementById("tab-barz").style.display = "none";

    }
    else if(this.router.url == "/profile"){
      document.getElementById("player-footer").style.display = "none";
    }
    else if(this.router.url == "/terms"){
      document.getElementById("player-footer").style.display = "none";
      document.getElementById("tab-barz").style.display = "none";
    }
    else if(this.service.getTrack().value != null){
      document.getElementById("player-footer").style.display = "inline";
      document.getElementById("tab-barz").style.display = "inline";
    }else{
      document.getElementById("tab-barz").style.display = "inline";
    }
  }
  

  profile_request(token:any,scope:any){
    
    
    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/profile/';
    var params = 'jwt='+token;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            const profile = JSON.parse(http.responseText);
            if(profile["SUCCESS"]){
              if(profile["profile"]==-1){  
                scope.service.setGuest(true);
              }else{
                scope.service.setGuest(false);

              }
              scope.jwt = token;
              scope.service.setJWT(token);
              scope.logged(true);
              scope.service.setLogged(true);
              scope.router.navigate(['/authors']);
            }else{
              scope.storage.set("jwt",null);
              scope.logged(false);
              scope.valid_profile = false;
              scope.router.navigate(['/login']);
            }
        }
    }
    http.withCredentials = true;
    http.send(params);
  
    
  }

  scan(){
    this.service.setScan(true);
  }

  verify(){
    this.storage.get('jwt').then((val) => {
      if(val!=null){
        this.profile_request(val,this);
      }
      else{
        document.getElementById("tab-barz").style.display = "none";
        this.router.navigate(['/login']);
      }
    });
  }

  
  Pause(paused:boolean){
    if(paused){
      document.getElementById("pause-button").setAttribute("name","pause-outline");
      this.sound.play();
    }
    else{
      document.getElementById("pause-button").setAttribute("name","play-outline");
      this.sound.pause();
    }
  }

  addTrack(data:any){
    this.album=[];
    for(let track in data){
      const track_data = {
        "id":data[track]["pk"],
        "order":track,
        "title":data[track]["title"],
        "url":"https://elibraria.ro/"+data[track]["url"],
      }
      this.album.push(track_data);
    }
  }

  changeAlbum(album_id:any){
    if(album_id != null){
      this.album = [];
      const URL = 'https://elibraria.ro/api/tracks/'+album_id+"/";
      this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
          this.addTrack(data.body);
      });

    }
  }
  
  nextAudio(){
    this.service.playNext();
  }

  prevAudio(){
    this.service.playPrev();
  }



  playTrack(track_id:any){
    if(track_id != null){
        var id = track_id;
        this.track_id = track_id;

        if(this.album.length-1 < parseInt(id)){
          id = 0;
        }

        this.sound.unload();
        this.sound.stop();
        if(this.router.url != "/musicplayer"){
          document.getElementById("player-footer").style.display = "inline";
        }
        this.service.addPrev(this.router.url);
        document.getElementById("track_title").innerHTML = this.album[id].title;
        this.sound = new Howl({
          html5:true,
          buffer:true,
          withCredentials:true,
          onplay: ()=>{
            this.service.set_trackId(id);
            this.service.setDuration(this.sound.duration());
          },

          src: [this.album[id].url]
        });
        this.sound.play();

    }
    
  }

  pause(){
    this.service.pauseAudio();
  }

  logged(status:boolean){
    if(status != null){
      if(status==true){
        document.getElementById("tab-barz").style.display = "block";
      }
      else{
        document.getElementById("player-footer").style.display = "none";
        document.getElementById("tab-barz").style.display = "none";
      }
    }
  }
  
  setPosition(pos:number){
    if(pos!=null){
      this.sound.seek(pos);
    }
  }

  update_checkpoint(){
    if(this.track_id != null){
      var track = this.album[this.track_id].id;
      var position = Math.floor(this.sound.seek());

      var http = new XMLHttpRequest();
      var url = 'https://elibraria.ro/api/add_checkpoint/'+track+"/"+position+"/";
      var params = 'jwt='+this.service.getJWT().getValue();
      http.open('POST', url, true);

      //Send the proper header information along with the request
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


      http.onreadystatechange = function() {//Call a function when the state changes.
          if(http.readyState == 4 && http.status == 200) {
            //do nothing
          }
      }
      http.withCredentials = true;
      http.send(params);
    }
  }

  moveToPlayer(){
    var prev = this.service.getPrevious();
    this.router.navigate(['/musicplayer']);
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.verify();
      this.service.getAlbum().subscribe(val=>this.changeAlbum(val));
      this.service.getTrack().subscribe(val=>this.playTrack(val));
      this.service.getPause().subscribe(val=>this.Pause(val));
      this.service.getPosition().subscribe(val=>this.setPosition(val));
      this.service.getLogged().subscribe(val=>this.logged(val));
    });
  }
}
