import { Component } from '@angular/core';
import { FormCoursComponent } from '../../../components/form-cours/form-cours.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [FormCoursComponent],
})
export class HomeComponent {
  constructor() {}
}
