import { Component, HostListener, OnDestroy } from '@angular/core';
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;

    // Afficher le footer lorsque la souris atteint le bas de la page
    if (scrollHeight >= documentHeight) {
      footer.style.display = 'block';
    } else {
      footer.style.display = 'none';
    }
  }
}
