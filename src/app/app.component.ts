import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../infrastructure/components/navbar/navbar.component";
import { HeaderComponent } from "../infrastructure/components/header/header.component";
import { CharactersComponent } from "./characters/characters.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, NavbarComponent, HeaderComponent, CharactersComponent]
})
export class AppComponent {
  title = 'j2d-manuel-gc';
}
