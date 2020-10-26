import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import {ChangeDetectorRef} from "@angular/core";
import {MainServiceService} from "../main-service.service";



@Component({
  selector: 'app-musiclist',
  templateUrl: './musiclist.page.html',
  styleUrls: ['./musiclist.page.scss'],
})
export class MusiclistPage implements OnInit {

  items = []

  constructor(private router: Router,private platform: Platform,private storage: Storage,private http: HttpClient,private ref:ChangeDetectorRef,private service: MainServiceService) { 
  }


  album(id:any){
    this.service.changeAlbum(id);
    this.service.addPrev(this.router.url);
    this.router.navigate(['/album-detail']);
  }

  get_author(author_id:any){
    const URL = 'https://elibraria.ro/api/author/'+author_id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
        return data.body[0]["name"];
      
    });
  }

  load_album(album:any){
    const URL = 'https://elibraria.ro/api/author/'+album.author+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
      const album_data = {
        "id":album.pk,
        "Title":album.title,
        "Author":data.body[0]["name"],
        "url":"https://elibraria.ro/"+album.image,
      }
      
      
      this.items.push(album_data);
    });
  }

  get_albums(jwt:any){
    if(jwt!=null){
      this.http.get<any>('https://elibraria.ro/api/albums/0/',{ withCredentials: true,observe: "response" }).subscribe(data => {
        for(let album in data.body){
          this.load_album(data.body[album]);
        }
      });
    }

  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.service.setScan(false);
      this.service.getJWT().subscribe(val=>this.get_albums(val));
    });

  }






}
