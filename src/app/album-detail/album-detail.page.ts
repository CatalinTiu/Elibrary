import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { MainServiceService } from '../main-service.service';
import { HttpClient } from '@angular/common/http';
import {ChangeDetectorRef} from "@angular/core";
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.page.html',
  styleUrls: ['./album-detail.page.scss'],
})
export class AlbumDetailPage implements OnInit {

  constructor(private title: Title,private platform: Platform,private http: HttpClient,public service: MainServiceService,private ref:ChangeDetectorRef,private router: Router,private storage:Storage) { }


  items=[]

  Track(id:any){
      if(this.service.getTrackPk().getValue() != this.items[id].id){
        this.service.setScan(false);
        this.service.changeTrack(id);
        this.service.setLoaded(false);
        this.router.navigate(['/musicplayer']);
      }else{
        this.router.navigate(['/authors']);
      }
    
  }

  private bookmarked: boolean;
  private id: any;
  private track_pk :any;

  addTrack(data:any){
    this.items=[];
    for(let track in data){
      const track_data = {
        "id":data[track]["pk"],
        "order":track,
        "title":data[track]["title"],
        "url":"https://elibraria.ro/"+data[track]["image"],
      }
      this.items.push(track_data);
    }
  }

  
  getTracks(id:any){
    if(id != null){
      const URL = 'https://elibraria.ro/api/tracks/'+id+"/";
      this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
          this.addTrack(data.body);
      });
    }
  }
  
  setAlbum(id:any){
    const URL = 'https://elibraria.ro/api/album/'+id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
        this.get_bookmarks(id);
        this.id = id;
        document.getElementById("album-title").innerHTML = data.body[0]["title"];
        document.getElementById("album-details").innerHTML = data.body[0]["details"];
        this.title.setTitle(data.body[0]["title"]);
        document.getElementById("album-image").style.backgroundImage = "linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(28,28,28, 1)),"+"url('https://elibraria.ro/"+data.body[0]["image"]+"')";
    });
    this.getTracks(id);
  }

  bookmark_request(jwt:any,album_id:any,scope:any):any{
    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/bookmarks/';
    var params = 'jwt='+jwt;
    http.open('POST', url, true);



    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
          var albums = JSON.parse(http.responseText); 
          for(let album in albums){
              if(albums[album]["album"]==album_id){
                document.getElementById("bookmark-icon").setAttribute("name","bookmark");
                scope.bookmarked = true;
              }
              else{
                document.getElementById("bookmark-icon").setAttribute("name","bookmark-outline");
                scope.bookmarked = false;
              }
          }
            
        }
    }
    http.withCredentials = true;
    http.send(params);
  }


  unSetbookmark(scope:any){

    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/remove_bookmark/'+this.id+"/";
    var jwt = this.service.getJWT().getValue();
    var params = 'jwt='+jwt;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          document.getElementById("bookmark-icon").setAttribute("name","bookmark-outline");
        }
    }
    http.withCredentials = true;
    http.send(params);
    

  }

  setBookmark(scope:any){

    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/add_bookmark/'+this.id+"/";
    var jwt = this.service.getJWT().getValue();
    var params = 'jwt='+jwt;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          
          document.getElementById("bookmark-icon").setAttribute("name","bookmark");
        }
    }
    http.withCredentials = true;
    http.send(params);
    

  }

  returnToPrev(){
    var prev = this.service.getPrevious();
    this.router.navigate([prev]);
  }

  bookmark(){
    if(this.bookmarked==true){
      this.unSetbookmark(this);
      this.bookmarked=false;
    }else{
      this.setBookmark(this);
      this.bookmarked=true;
    }
  }

  get_bookmarks(album_id:any){
    var jwt = this.service.getJWT().getValue();
    this.bookmark_request(jwt,album_id,this);
    
  }

  setTrackPk(pk:any){
    if(this.track_pk != null){
      this.track_pk = pk;
    }
  }

  ngOnInit() {
    this.platform.ready().then((res) => {
      this.service.getAlbum().subscribe((val) => this.setAlbum(val));
      this.service.getTrackPk().subscribe((val) => this.setTrackPk(val));
    });
  }

}
