import { Component, OnInit,AfterViewInit, NgZone  } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { PostingService } from "../posting.service";
import { Router, NavigationStart } from "@angular/router";
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public welcome;
  public err;
  public errmsg;
  hide = true;
  loading = false;

  constructor(private fb:FormBuilder, private postingService: PostingService,
    private router: Router, private ngZone: NgZone) {

    }

  loginForm = this.fb.group({
    Email: ['',[Validators.required,Validators.email]],
    Password: ['',Validators.required]
  })


  public auth2;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        // client_id: '696722103264-rd8spnvgcnnf1jev19vjkvreu20li7s8.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }
  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log(profile)
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('First Name: ' + profile.getGivenName());
        console.log('last Name: ' + profile.getFamilyName());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
      this.loginForm.value.FirstName =  profile.getGivenName();
      this.loginForm.value.LastName =  profile.getFamilyName();
      this.loginForm.value.Email =  profile.getEmail();
      console.log(this.loginForm.value);

      this.postingService.loginByGoogle(this.loginForm.value).subscribe(
        data=>{
          console.log("data",data)
          if(data === null){
            this.errmsg= true;
            this.ngZone.run(() => this.router.navigate(['/login'])).then();
                this.err = "Email is already in use, try again with another Email";
                setTimeout(() => {
                  this.err = "";
                 }, 5000);
          }
          else if(this.loginForm.value.Email===data.Email){
            console.log("fdfd");
            this.loginForm.reset();
                window.localStorage.setItem('token', data.Email);
                this.ngZone.run(() => this.router.navigate(['/welcome'])).then();
                // this.router.navigate(['/welcome']);
          }
          else {
            this.err = "Technical Issue, please try again later";
            setTimeout(() => {
              this.err = "";
            }, 5000);
          }
        },
        errr=>{
          console.log("Error",errr)
        this.err = "Technical Issue, please try again later";
        setTimeout(() => {
          this.err = "";
         }, 5000);
        }
      )
      });
  }

  ngAfterViewInit(){
      this.googleInit();
  }

  onSubmit(){
    this.postingService.login(this.loginForm.value).subscribe(
      data=>{
        console.log(data);
        if(data === 0){
          console.log("used")
          this.errmsg= true;
              this.err = "Invalid Email or Pasword";
              setTimeout(() => {
                this.err = "";
               }, 5000);
        }
        else if(this.loginForm.value.Email===data.Email){

          console.log("fdfd")
          this.loginForm.reset();
              window.localStorage.setItem('token', data.Email);
              this.router.navigate(['/welcome']);
              // this.router.navigate(['/welcome']);
        }
      }
    )
  }

  ngOnInit() {
  }

}
