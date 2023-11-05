import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../infrastructure/components/header/header.component";
import { CharactersComponent } from "./characters/characters.component";

@Component({
    selector: "app-root",
    standalone: true,
    templateUrl: "./app.component.html",
    imports: [
        CommonModule,
        HeaderComponent,
        CharactersComponent,
    ],
})
export class AppComponent {
    protected height = 0;
    title = "j2d-manuel-gc";

    constructor(private changeDetectorRef: ChangeDetectorRef){}

    getHeight(ev: number) {
        this.height = ev;
        this.changeDetectorRef.detectChanges(); // Required for child component to get value reactively
    }
}
