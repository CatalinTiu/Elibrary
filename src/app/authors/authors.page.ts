import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {ChangeDetectorRef} from "@angular/core";
import { MainServiceService } from "../main-service.service";
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-authors',
  templateUrl: './authors.page.html',
  styleUrls: ['./authors.page.scss'],
})
export class AuthorsPage implements OnInit {


  items=[];

  constructor(private platform:Platform,private storage: Storage,private http: HttpClient,private ref:ChangeDetectorRef,private service: MainServiceService,private router: Router) { }

  author(id:any):void{
    this.service.changeAuthor(id);
    this.service.addPrev(this.router.url);
    this.router.navigate(['/author-detail']);
  }

  load_author(author:any){
    const data = {
      "id":author.pk,
      "Author":author.name,
      "url":"https://elibraria.ro/"+author.image,
    }
    

    this.items.push(data);
  }

  get_authors(jwt:any){
    if(jwt!=null){
      this.http.get<any>('https://elibraria.ro/api/authors/',{ withCredentials: true,observe: "response" }).subscribe(data => {
        for(let author in data.body){
          this.load_author(data.body[author]);
        }
      });
    }
    
  }


  clear(status:boolean){
    if(status == false){
      this.items=[];
    }
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      document.getElementById("tab-barz").style.display = "inline";
      this.service.getJWT().subscribe(val => this.get_authors(val));
      this.service.getLogged().subscribe(val=>this.clear(val));
      this.ref.detectChanges(); 
    });
  }

}
