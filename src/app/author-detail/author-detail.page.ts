import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../main-service.service';
import { HttpClient } from '@angular/common/http';
import {ChangeDetectorRef} from "@angular/core";
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoginPageRoutingModule } from '../login/login-routing.module';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.page.html',
  styleUrls: ['./author-detail.page.scss'],
})
export class AuthorDetailPage implements OnInit {


  constructor(private service: MainServiceService,private http: HttpClient,private ref:ChangeDetectorRef,private router:Router,private platform: Platform) {
  }

  
  items = []

  Album(album_id:any){
    this.service.changeAlbum(album_id);
    this.service.addPrev(this.router.url);
    this.router.navigate(["/album-detail"]);
  }

  load_album(album:any){
    const URL = 'https://elibraria.ro/api/author/'+album.author+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
      const album_data = {
        "id":album.pk,
        "Title":album.title,
        "url":"https://elibraria.ro/"+album.image,
      }
      
      this.service.changeAlbum(album);
      this.items.push(album_data);
    });
  }

  get_albums(author_id:any){
    const URL = 'https://elibraria.ro/api/albums/'+author_id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
      for(let album in data.body){
        this.load_album(data.body[album]);
      }
    });
  }

  returnToPrev(){
    var prev = this.service.getPrevious();
    this.router.navigate([prev]);
  }


  setAuthor(author_id:any){
    if(author_id != null){
      this.items = [];
      const URL = 'https://elibraria.ro/api/author/'+author_id+"/";
      this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
          const image_url= 'https://elibraria.ro/'+data.body[0]["image"];
          document.getElementById("author-details").innerHTML = data.body[0]["details"];
          document.getElementById("author-title").innerHTML = data.body[0]["name"];
          document.getElementById("author-image").style.backgroundImage = "linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(20, 20, 20, 1)),"+"url('"+image_url+"')"
      });
      this.get_albums(author_id);
    }
  }

  ngOnInit() {
    this.platform.ready().then((res) => {
      this.service.getAuthor().subscribe((val) => this.setAuthor(val));
      this.ref.detectChanges(); 
    });
  }

}
