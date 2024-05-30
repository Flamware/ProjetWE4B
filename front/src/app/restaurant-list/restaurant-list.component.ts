import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {
  restaurants = [
    { name: 'Restaurant 1', distance: '1 km' },
    { name: 'Restaurant 2', distance: '2 km' },
    // Add more restaurants as needed
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
