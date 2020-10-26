import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from "../main-service.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  items=[];

  constructor(private storage: Storage,private http: HttpClient, private service: MainServiceService,private router: Router) { }

  get_album(album_id:any){
    const URL = 'https://elibraria.ro/api/album/'+album_id+"/";
    this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
      const album_id = data.body[0]["pk"];
      const title = data.body[0]["title"];
      const image = "https://elibraria.ro/"+data.body[0]["image"];

      const URL = 'https://elibraria.ro/api/author/'+data.body[0]["author"]+"/";
      this.http.get<any>(URL,{ withCredentials: true,observe: "response" }).subscribe(data => {
        const album_data = {
          "id":album_id,
          "Title":title,
          "Author":data.body[0]["name"],
          "url":image,
        }

        this.items.push(album_data);
      });
    
         
    });
  }


  Album(album_id:any){
    this.service.changeAlbum(album_id);
    this.router.navigate(["/album-detail"]);
  }


  bookmark_request(jwt:any,scope:any):any{
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
            scope.get_album(albums[album]["album"]);
          }
            
        }
    }
    http.withCredentials = true;
    http.send(params);
  }

  get_bookmarks(){
    var jwt = this.service.getJWT().getValue();
    this.bookmark_request(jwt,this);

  }

  ngOnInit() {
    this.get_bookmarks();
  }

}
