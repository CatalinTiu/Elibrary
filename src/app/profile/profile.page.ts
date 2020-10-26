import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MainServiceService} from '../main-service.service'
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private platform: Platform,private storage: Storage,private http: HttpClient,private router: Router,public service: MainServiceService) { }


  logout(){
    this.service.setLogged(false);
    this.storage.set("jwt",null);
    this.router.navigate(["/login"]);
  }

  profile_request(token:any){
    
    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/profile/';
    var params = 'jwt='+token;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            const profile = JSON.parse(http.responseText);
            document.getElementById("Name").innerHTML = profile["name"];
            if(profile["SUCCESS"]){
              if(profile["picture"]==null){
                document.getElementById("Image").setAttribute("src","https://elibraria.ro/statics/images/guest.png");
                document.getElementById('delete-btn').style.display = 'none';
              }else{
                document.getElementById("Image").setAttribute("src",profile["picture"]);
              }
            }
        }
    }
    http.withCredentials = true;
    http.send(params);
  
    
  }

  delete_profile(){
    var token = this.service.getJWT().getValue();
    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/profile/delete/';
    var params = 'jwt='+token;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            const delete_status = JSON.parse(http.responseText);
            if(delete_status["SUCCESS"]){ 
              console.log("account deleted");
            }
        }
    }
    http.withCredentials = true;
    http.send(params);
    this.logout();
  }


  terms(){
    this.service.getPrevious();
    this.router.navigate(['/terms']);
  }

  get_profile(jwt:any){
    if(jwt!=null){
      this.http.get<any>('https://elibraria.ro/api/auth/',{ withCredentials: true,observe: "response" }).subscribe(data => {
        this.profile_request(jwt);
      });
    }
  
  }

  ngOnInit() {
    this.platform.ready().then(() => {
    this.service.getJWT().subscribe(val => this.get_profile(val));
    });
  }

}
