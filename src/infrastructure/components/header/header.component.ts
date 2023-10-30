import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgOptimizedImage } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: "app-header",
    standalone: true,
    imports: [
        // @angular/common
        NgOptimizedImage,

        // autocomplete
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        NgFor,
        AsyncPipe,

        // search
        MatIconModule,
    ],
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    host: { class: "app-header" },
})
export class HeaderComponent {
    nameCtrl = new FormControl("");
    options: string[] = ["One", "Two", "Three"];
    filteredOptions!: Observable<string[]>;

    ngOnInit() {
        this.filteredOptions = this.nameCtrl.valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ""))
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option =>
            option.toLowerCase().includes(filterValue)
        );
    }
}
