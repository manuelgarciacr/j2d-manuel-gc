import { Component, ElementRef, Input } from '@angular/core';
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

    constructor(private host: ElementRef){}

    onClick() {

        setTimeout(() => {
            // It needs a waiting time to work correctly
            this.clicked =
                this.clicked == this.character.id ? 0 : this.character.id;
        }, 100)
    }
}
