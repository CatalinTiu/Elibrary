// import { Component, OnInit } from '@angular/core';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
// import { HttpClient } from '@angular/common/http';
// import {CookieService} from 'ngx-cookie-service';
// import { Storage } from '@ionic/storage';
// import { Router } from '@angular/router';
// import { MainServiceService } from '../main-service.service';
// import {
//   SocialService,
//   FacebookLoginProvider,
//   GoogleLoginProvider
// } from "ngx-social-button";
// import { Platform } from '@ionic/angular';



// @Component({
//   selector: 'app-login',
//   templateUrl: './login.page.html',
//   styleUrls: ['./login.page.scss'],
// })

// export class LoginPage implements OnInit {

//   constructor(private socialAuthService: SocialService,private platform: Platform,private fb: Facebook,private http: HttpClient,private cookie: CookieService,private storage: Storage,private router: Router,public service: MainServiceService) {
//     this.ngOnInit();
//   }

//   auth(token:any,userid:any,platform:any):void{
   
//     this.get_jwt(token,platform,userid,this.storage,this.router,this.service,this);
  
//   }


//   get_jwt(token:any,platform:any,userid:any,storage: Storage,router: Router,service: MainServiceService,scope:any){


//     console.log(token);
//     console.log(userid);

//     var http = new XMLHttpRequest();
//     var url = 'https://elibraria.ro/api/auth/';
//     var params = 'access_token='+token+'&user_id='+userid+'&platform='+platform;
//     http.open('POST', url, true);

//     //Send the proper header information along with the request
//     http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


//     http.onreadystatechange = function() {//Call a function when the state changes.
//         if(http.readyState == 4 && http.status == 200) {
//             storage.set('jwt', JSON.parse( http.responseText)["jwt"]);
//             service.setLogged(true);
//             service.setJWT(JSON.parse( http.responseText)["jwt"]);
//             router.navigate(['/authors']);
//         }
//     }
//     http.withCredentials = true;
//     http.send(params);

//   }


//   log_guest():void{
//     this.auth("guest","guest","guest");
//   }
  
  

//   log_facebook():void{
//     if(document.URL.startsWith('https://localhost') || document.URL.startsWith('ionic://localhost')) {
//       this.fb.login(['public_profile', 'email'])
//       .then((res: FacebookLoginResponse) =>  {this.auth(res.authResponse.accessToken,res.authResponse.userID,"facebook")} )
//       .catch(e => document.getElementById('content').innerHTML = e.stack);
//     }else {
//       this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_TYPE).then(
//         (socialUser) => {
//             this.auth(socialUser.accessToken,socialUser.id,"facebook");
//       });
//     }

//   }

  

//   ngOnInit() {
//   }

// }

import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { HttpClient } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { MainServiceService } from '../main-service.service';
import {
  SocialService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from "ngx-social-button";
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  constructor(private socialAuthService: SocialService,private platform: Platform,private fb: Facebook,private http: HttpClient,private cookie: CookieService,private storage: Storage,private router: Router,public service: MainServiceService) {
    this.ngOnInit();
  }

  auth(token:any,userid:any,platform:any):void{
   
    this.get_jwt(token,platform,userid,this.storage,this.router,this.service,this);
  
  }


  get_jwt(token:any,platform:any,userid:any,storage: Storage,router: Router,service: MainServiceService,scope:any){


    console.log(token);
    console.log(userid);

    var http = new XMLHttpRequest();
    var url = 'https://elibraria.ro/api/auth/';
    var params = 'access_token='+token+'&user_id='+userid+'&platform='+platform;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            storage.set('jwt', JSON.parse( http.responseText)["jwt"]);
            service.setLogged(true);
            service.setJWT(JSON.parse( http.responseText)["jwt"]);
            router.navigate(['/authors']);
        }
    }
    http.withCredentials = true;
    http.send(params);

  }


  log_guest():void{
    this.auth("guest","guest","guest");
  }
  
  log_facebook():void{
    if(document.URL.startsWith('https://localhost') || document.URL.startsWith('ionic://localhost')) {
      this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) =>  {this.auth(res.authResponse.accessToken,res.authResponse.userID,"facebook")} )
      .catch(e => document.getElementById('content').innerHTML = e.stack);
    }else {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_TYPE).then(
        (socialUser) => {
            this.auth(socialUser.accessToken,socialUser.id,"facebook");
      });
    }

  }

  

  ngOnInit() {
  }

}