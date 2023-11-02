import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { ICharacter } from 'src/domain/model/ICharacter';

@Component({
    selector: "app-card",
    standalone: true,
    imports: [MatCardModule],
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"],
})
export class CardComponent {
    @Input() character!: ICharacter;
    protected clicked = 0;
}
