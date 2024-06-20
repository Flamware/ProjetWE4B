import { Component, OnInit } from '@angular/core';
import { TestService } from '../test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone: true,
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  testData: any;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.testService.getTest().subscribe(
      data => {
        this.testData = data;
        console.log('Test data:', data);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
