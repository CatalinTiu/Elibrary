import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Platform, LoadingController } from '@ionic/angular';
import { MainServiceService } from '../main-service.service';
import { Observable, BehaviorSubject } from "rxjs";



@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.page.html',
  styleUrls: ['./musicplayer.page.scss'],
})
export class MusicplayerPage implements OnInit {

  constructor(
    public platform: Platform,
    private service: MainServiceService,
    private http: HttpClient,
    private router: Router
  ) {
    this.updateBar();
  }

  duration: number = 10;
  paused: boolean = false;
  position: number = 0;
  album_image: any;
  author_name: any;
  track: any;
  tracks = [];
  prev_seconds:any=0;

  updateBar(){
    setInterval(() =>{ 
      if(this.position < this.duration && this.paused == false){
        if(this.prev_seconds-this.position<-1||this.position-this.prev_seconds<-1){
          this.service.changePosition(this.position);
        }
        this.prev_seconds = this.position;
        this.position += 1;   
        document.getElementById("startTime").innerHTML = this.secondsToHms(this.position);
      } 
    }, 1000);
  }

  returnToPrev(){
    var prev = this.service.getPrevious();
    this.router.navigate([prev]);
  }


  pause(){
    this.service.pauseAudio();
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);


    var hDisplay = h.toString();
    var mDisplay = m.toString();
    var sDisplay = s.toString();

    if(h<10){
      hDisplay = "0"+hDisplay;
    }
    if(m<10){
      mDisplay = "0"+mDisplay;
    }
    if(s<10){
      sDisplay = "0"+sDisplay;
    }

    return hDisplay +":"+ mDisplay+ ":" + sDisplay; 
}

  next(){
    this.service.playNext();
  }

  prev(){
    this.service.playPrev();
  }

  Pause(paused:boolean){
    if(paused){
      this.paused = false;
      document.getElementById("pause-button-2").setAttribute("name","pause-outline");
    }
    else{
      this.paused = true;
      document.getElementById("pause-button-2").setAttribute("name","play-outline");
    }
  }

  get_author(author_id:any){
    const URL = 'https://elibraria.ro/api/author/'+author_id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
        document.getElementById("album-author").innerHTML = data.body[0]["name"];
    });
  }

  getTracks(album_id:any){
    const URL = 'https://elibraria.ro/api/tracks/'+album_id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
        var tracks = data.body;
        for(let track in tracks){
          const track_data = {
            "id":tracks[track]["pk"],
            "order":track,
            "title":tracks[track]["title"],
            "url":"https://elibraria.ro/"+tracks[track]["image"],
          }
          this.tracks.push(track_data);
        }
    });
    
  }

  get_checkpoint(track_id: any,scope: any){
    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/checkpoint/'+track_id+"/";
    var params = 'jwt='+this.service.getJWT().getValue();
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
          var checkpoint = JSON.parse(http.responseText);
          if(checkpoint[0].SUCCESS == true) {
            scope.prev_seconds = checkpoint[0].seconds-1;
            scope.position = checkpoint[0].seconds;
            scope.service.changePosition(checkpoint[0].seconds);
          }else{
            scope.prev_seconds = 0;
            scope.position = 0;
            scope.service.changePosition(0);
            
          }
        
            
        }
    }
    http.withCredentials = true;
    http.send(params);

  }

  setAlbum(id:any){
    if(id != null && this.router.url == '/musicplayer'){
      this.service.setLoaded(true);
      this.getTracks(id);
      const URL = 'https://elibraria.ro/api/album/'+id+"/";
      this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
          
            this.get_author(data.body[0]["author"]);
            this.album_image = "https://elibraria.ro/"+data.body[0]["image"];

            var title = data.body[0]["title"];
        
            document.getElementById("album-titles").innerText = title;
      });
    }
  }

  setTrack(id:any){
    this.track = id;
    this.position = 0;
    document.getElementById("startTime").innerHTML = this.secondsToHms(0);
  }

  setDuration(duration:number){
    if(duration != null){
      document.getElementById("endTime").innerHTML = this.secondsToHms(duration);
      this.duration = duration;
    }
  }

  ngOnInit() {
    this.platform.ready().then((res) => {
      this.service.getTrack().subscribe(val=>this.setTrack(val));
      this.service.getAlbum().subscribe(val=>this.setAlbum(val));
      this.service.getPause().subscribe(val=>this.Pause(val));
      this.service.getDuration().subscribe(val=>this.setDuration(val));
    });
  }



}
