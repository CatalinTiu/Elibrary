import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { HttpClientModule } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import { Media } from '@ionic-native/media/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {
  NgxSocialButtonModule,
  FacebookLoginProvider,
  SocialServiceConfig
} from "ngx-social-button";


export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
      .addFacebook("2698479140406186")
      .addGoogle("54653498658-enikqta3n77rrjslp29mvrn03hulvget.apps.googleusercontent.com");
  return config;
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, NgxSocialButtonModule, IonicStorageModule.forRoot({name: '_mydb',driverOrder: ['localstorage']}),],
  providers: [
    StatusBar,
    BarcodeScanner,
    SplashScreen,
    Storage,
    CookieService,
    Facebook, 
    Media,
    {
      provide: SocialServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
