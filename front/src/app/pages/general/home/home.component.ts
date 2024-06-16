import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

type mentor = {
    firstname: string,
    lastname: string,
    email: string,
    profile_picture?:any
};

type course = {
    name : string,
    desc : string,
    picture?: string
};

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [CommonModule],
})
export class HomeComponent {
    mentors: mentor[] = [
        {firstname : "Alice", lastname : "Test", email : "test@test.fr"},
        {firstname : "Bob", lastname : "Test", email : "test@test.fr"},
        {firstname : "Charles", lastname : "Test", email : "test@test.fr"},
        {firstname : "Dorothée", lastname : "Test", email : "test@test.fr"},
        {firstname : "Eliott", lastname : "Test", email : "test@test.fr"},
        {firstname : "Fabrice", lastname : "Test", email : "test@test.fr"}
    ];

    courses: course[] = [
        {name : "SI40", desc : "Database"},
        {name : "WE4A", desc : "Web angular"},
        {name : "LJ00", desc : "Japanese"},
        {name : "RS40", desc : "Cybersecurity"},
        {name : "IT41", desc : "Maths"},
        {name : "SY43", desc : "Android developpement"}
    ]
    constructor(public auth: AuthService) {}

    getMentors() {
        
    }
}
