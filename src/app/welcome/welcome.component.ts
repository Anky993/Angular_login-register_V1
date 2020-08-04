import { Component, OnInit } from '@angular/core';
import { PostingService } from "../posting.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  data;
  constructor(private postingService:PostingService, private router:Router) { }

  getdata() {
    this.postingService.getdata().subscribe(
      data =>{
        this.data= data;
        console.log(this.data);
      }
    )
  }

  ngOnInit() {
    if(!window.localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.getdata()
  }

}
