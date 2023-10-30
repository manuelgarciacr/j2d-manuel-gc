import { Component } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
    selector: "navbar",
    standalone: true,
    templateUrl: "./navbar.component.html",
    imports: [
        NgbCollapse,
        MatTabsModule,
    ],
})
export class NavbarComponent {
    protected isMenuCollapsed = true;

    constructor() {}

}
