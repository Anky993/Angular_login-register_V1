import { Component, OnInit,AfterViewInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { PostingService } from "../posting.service";
import { Router } from "@angular/router";
declare const gapi: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements AfterViewInit {
  hide = true;
  public welcome;
  public err;
  public welmsg = false;
  public errmsg = false;

  pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  passwordRegex: any = '((?=.*\d)(?=.*[a-zA-Z]).{4,20})' ;

  constructor(private fb:FormBuilder, private postingService: PostingService,
     private router: Router, private ngZone: NgZone) { }
  registerForm = this.fb.group({
    FirstName:['', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]],
    LastName:[''],
    Email:['',[Validators.required,Validators.email]],
    Password:['',[Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)]],
    ConfirmPassword:['',Validators.required]
  })

  ngOnInit() {
    // console.log(this.registerForm.value)
  }

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
      this.registerForm.value.FirstName =  profile.getGivenName();
      this.registerForm.value.LastName =  profile.getFamilyName();
      this.registerForm.value.Email =  profile.getEmail();

    // this.registerForm.removeControl('ConfirmPassword');
      console.log(this.registerForm.value);

      this.postingService.registerByGoogle(this.registerForm.value).subscribe(
        data=>{
          if(data === 0){
            console.log("use")
            this.errmsg= true;

            this.ngZone.run(() => this.router.navigate(['/register'])).then();
                this.err = "Email is already in use, try again with another Email";
                setTimeout(() => {
                  this.err = "";
                 }, 3000);
          }
          else if(this.registerForm.value.Email===data.Email){
            console.log("fdfd")
            this.registerForm.reset();
                window.localStorage.setItem('token', data.Email);
                this.ngZone.run(() => this.router.navigate(['/welcome'])).then();
          }
        }
      )
      });
  }

  ngAfterViewInit(){
      this.googleInit();
  }

  onSubmit(){
    // this.registerForm.removeControl('ConfirmPassword');
    // this.registerForm.updateValueAndValidity();
    this.registerForm.value.Email=this.registerForm.value.Email.toLowerCase();
    this.postingService.register(this.registerForm.value).subscribe(
      data=>{
        if(data === 0){
          console.log("used")
          this.errmsg= true;
              this.err = "Email is already in use, try again with another Email";
              setTimeout(() => {
                this.err = "";
               }, 5000);
        }
        else if(this.registerForm.value.Email===data.Email){
          console.log("fdfd")
          this.registerForm.reset();
              window.localStorage.setItem('token', data.Email);
              this.router.navigate(['/welcome']);
              // this.router.navigate(['/welcome']);
        }
      }
    )
  }
}
