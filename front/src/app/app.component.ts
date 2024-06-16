import { Component, OnDestroy } from '@angular/core';
import {FooterComponent} from "./footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./header/header.component";
import {HttpClient} from "@angular/common/http";

interface UserResponse {
  existing: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    FooterComponent,
    RouterOutlet,
    HeaderComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }


  ngOnDestroy(): void {

  }
}
