import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject} from 'rxjs';
import { LoginPageRoutingModule } from './login/login-routing.module';
import { NumberValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  private selectedAuthor = new BehaviorSubject<string>(null);
  private selectedAlbum = new BehaviorSubject<string>(null);
  private selectedTrack = new BehaviorSubject<string>(null);
  private TrackPk = new BehaviorSubject<string>(null);
  private nextTrack = new BehaviorSubject<string>(null);
  private prevTrack = new BehaviorSubject<string>(null);
  private paused = new BehaviorSubject<boolean>(false);
  private albumLength: number;
  private duration = new BehaviorSubject<number>(null);
  private position = new BehaviorSubject<number>(null);
  private logged = new BehaviorSubject<boolean>(false);
  private scan = new BehaviorSubject<boolean>(false);
  private previous: string[] = [];
  private JWT = new BehaviorSubject<string>(null);
  private track_id: any;
  private guest: boolean;
  private album: any[] = [];
  private loaded: boolean = false;

  constructor(private http: HttpClient,private router: Router) {}

  changeAuthor(id:any){
    this.selectedAuthor.next(id); 
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

  setLoaded(val:boolean){
    this.loaded = val;
  }

  getLoaded(){
    return this.loaded;
  }

  changeAlbum(id:any){
    const URL = 'https://elibraria.ro/api/tracks/'+id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
      this.albumLength = data.body.length;
      this.addTrack(data.body);
    });
    this.selectedAlbum.next(id); 
  }

  setJWT(jwt:string){
    this.JWT.next(jwt);
  }

  changeTrack(id:any){
    this.changePosition(0);
    this.paused.next(true);
    this.selectedTrack.next(id);
    this.TrackPk.next(this.album[id].id);
  }

  
  changePosition(pos:number){
    this.position.next(pos);
  }

  addPrev(url:string){
    this.previous.push(url);
  }

  setLogged(value:boolean){
    this.logged.next(value);
  }

  setGuest(val:boolean){
    this.guest = val
  }

  getGuest(){
    return this.guest
  }

  setDuration(duration: any){
    this.duration.next(duration);
  }

  setScan(value: boolean){
    this.scan.next(value);
  }


  playNext(){
    var nextTrack = parseInt(this.selectedTrack.value)+1;
    this.paused.next(true);
    if(nextTrack > this.albumLength-1){
      nextTrack = 0;
    }
    this.selectedTrack.next(nextTrack.toString());
  }

  playPrev(){
    var prevTrack = parseInt(this.selectedTrack.value)-1;
    this.paused.next(true);
    if(prevTrack < 0){
      prevTrack = this.albumLength-1;
    }
    this.selectedTrack.next(prevTrack.toString());
  }

  pauseAudio(){
    this.paused.next(!this.paused.value);
  }

  getAuthor(): BehaviorSubject<string>{
    return this.selectedAuthor;
  }

  getTrackPk():BehaviorSubject<string>{
    return this.TrackPk;
  }

  getJWT():BehaviorSubject<string>{
    return this.JWT;
  }

  getScan(): BehaviorSubject<boolean>{
    return this.scan;
  }

  getPause(): BehaviorSubject<boolean>{
    return this.paused;
  }

  getLogged(): BehaviorSubject<boolean>{
    return this.logged;
  }

  getDuration(): BehaviorSubject<number>{
    return this.duration;
  }

  getPrevious(){
    var prev = this.previous[this.previous.length - 1];

    this.previous.pop();
    return prev;
  }

  set_trackId(id:any){
    this.track_id = id;
  }

  get_trackId(){
    return this.track_id;
  }

  getPosition(): BehaviorSubject<number>{    
    return this.position;
  }

  getAlbum(): BehaviorSubject<string>{
    return this.selectedAlbum;
  }

  getTrack(): BehaviorSubject<string>{
    return this.selectedTrack;
  }
}
