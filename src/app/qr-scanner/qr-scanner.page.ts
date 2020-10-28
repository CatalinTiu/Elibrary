import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {MainServiceService} from '../main-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  constructor(private http: HttpClient,private barcodeScanner: BarcodeScanner,private service: MainServiceService,private router: Router) { }


  // scan_mobile(){
  //   this.barcodeScanner.scan( {
  //       preferFrontCamera : true, // iOS and Android
  //       showFlipCameraButton : true, // iOS and Android
  //       showTorchButton : true, // iOS and Android
  //       torchOn: false, // Android, launch with the torch switched on (if available)
  //       prompt : "", // Android
  //       resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
  //       formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
  //       orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
  //       disableAnimations : true, // iOS
  //       disableSuccessBeep: false // iOS and Android
  //   }).then(barcodeData => {
  //       const album_id = JSON.parse(barcodeData.text)["album_id"];
  //       if(album_id != null && typeof(album_id)=== 'number'){
  //         this.service.setScan(false);
  //         this.service.changeAlbum(album_id);
  //         this.router.navigate(['/album-detail']);
  //       }else{
  //         this.service.setScan(false);
  //         this.router.navigate(['/musiclist']);
  //       }
        
  //     }).catch(err => {
  //       console.log('Error', err);
  //     });  
  // }
  scan_mobile(){
    this.barcodeScanner.scan( {
        preferFrontCamera : true, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt : "", // Android
        resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
    }).then(barcodeData => {
        if(barcodeData.cancelled){
          this.service.setScan(false);
        }else{
          const album_id = JSON.parse(barcodeData.text)["album_id"];
          if(album_id != null && typeof(album_id)=== 'number'){
            this.service.setScan(false);
            this.service.changeAlbum(album_id);
            this.router.navigate(['/album-detail']);
          }else{
            this.service.setScan(false);
            this.router.navigate(['/musiclist']);
          }
        }
      }).catch(err => {
        console.log('Error', err);
      });  
  }


 

  browser_scan(){
    this.http.get<any>('https://elibraria.ro/api/get_app/',{ withCredentials: true,observe: "response" }).subscribe(data => {
      document.getElementById("app-div").style.display = "inline";
      document.getElementById("google-play").setAttribute("href",data.body["google"]);
      document.getElementById("appstore").setAttribute("href",data.body["apple"]);
    });
  }

  scan(val:any){
    if(val == true){
      this.service.setScan(false);
      if(document.URL.startsWith('https://elibraria.ro')) {
        this.browser_scan();
      } else {
        this.scan_mobile();
      }
    }
  }
  

  ngOnInit() {
    this.service.getScan().subscribe(val=>this.scan(val));
  }

}
