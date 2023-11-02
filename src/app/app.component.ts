import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../infrastructure/components/navbar/navbar.component";
import { HeaderComponent } from "../infrastructure/components/header/header.component";
import { CharactersComponent } from "./characters/characters.component";
import { Observable } from 'rxjs';

@Component({
    selector: "app-root",
    standalone: true,
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    imports: [
        CommonModule,
        NavbarComponent,
        HeaderComponent,
        CharactersComponent,
    ],
})
export class AppComponent {
    protected height$!: Observable<number>;
    protected height = 0;
    title = "j2d-manuel-gc";

    constructor(private changeDetectorRef: ChangeDetectorRef){};

    getHeaderHeight(ev: Observable<number>) {
        console.log(ev, "WWWWW");
        this.height$ = ev;
    }
    getHeight(ev: number) {
        console.log("SET", ev);
        this.height = ev;
        this.changeDetectorRef.detectChanges();
    }
}
