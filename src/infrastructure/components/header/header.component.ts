import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AsyncPipe, NgFor, NgOptimizedImage } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { Observable, map, startWith, tap, of } from 'rxjs';
import { CharactersService } from 'src/domain/services/characters.service';
import { ICharacter } from 'src/domain/model/ICharacter';

@Component({
    selector: "app-header",
    standalone: true,
    imports: [
        NgOptimizedImage,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        NgFor,
        AsyncPipe,
        MatIconModule,
    ],
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    host: { class: "app-header" },
})
export class HeaderComponent {
    @ViewChild(MatAutocompleteTrigger)
    protected autocomplete!: MatAutocompleteTrigger; // Autocomplete pannel access
    @Output() public heightEv: EventEmitter<number> = new EventEmitter(); // Emits the header height in pixels
    private totalCharacters = 0; // Total characters in the BDD
    protected nameCtrl = new FormControl(""); // Filter text control
    protected readCharacters: ICharacter[] = []; // Reader characters from the API
    protected filteredCharacters$ = new Observable<ICharacter[]>(); // Filtered characters
    protected filteredNames$!: Observable<string[]>; // Filtered names of the characters
    protected counter = ""; // Counters text
    protected isPanelOpened = false; // Switch to styling the selection panel.

    constructor(private service: CharactersService, private host: ElementRef) {}

    ngOnInit() {
        const element = this.host.nativeElement.firstChild; // DOM header element
        const heightObserver = new ResizeObserver(entries => {
            const height = entries[0].contentRect.height;
            this.heightEv.emit(height); // Emits the header height reactively
        });
        heightObserver.observe(element); // Sets the element to check

        // When the name filter string changes, the Observable 'valueChanges' emits the new value.
        // With the new value, the pipe filters the characters, sets the counters,
        //   sets the values for the filtered names Observable and outputs the array of filtered
        //   characters.
        // Subscription to 'valueChanges' inputs the new values into the Observable (Subject)
        //   'filteredCharacters$' from the character service.
        this.nameCtrl.valueChanges
            .pipe(
                startWith(""),
                map(value => this._filter(value || "")),
                tap(res => this._setCounter(res.length)),
                tap(res => this._setFilteredNames(res))
             )
            .subscribe(res => {
                this.service.setFilteredCharacters(res);
            });

        // Subscription to Observable (Subject) 'chars$' handles new values
        //   as in the previous process, also updating the total number of characters
        //   (this number may change on the server) and the array of characters read
        this.service.characters$.subscribe(resp => {
            this.readCharacters = resp;
            this.totalCharacters = this.service.totalCharacters;
            const filtered = this._filter(this.nameCtrl.value || "");
            this._setCounter(filtered.length);
            this._setFilteredNames(filtered);
            this.service.setFilteredCharacters(filtered);
        });
    }

    protected closePanel = () => {
        setTimeout(() => this.autocomplete.closePanel()); // Necessary to prevent panel reopening
    };

    /**
     * Filter the read characters by name substring not case sensitive
     *
     * @param value Substring to filter to
     * @returns Array of filtered characters
     */
    private _filter(value: string): ICharacter[] {
        const filterValue = value.toLowerCase();

        return this.readCharacters.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    /**
     * Sets the values of the Observable of filtered names
     * This Observable is used by the autocomplete selection control
     *
     * @param characters Array with the filtered characters
     */
    private _setFilteredNames = (characters: Array<ICharacter>) => {
        this.filteredNames$ = of([...new Set(characters.map(v => v.name))]);
    };

    /**
     * Text of the characters counter: "total filtered / total read / total characters"
     *
     * @param filtered Length of the array with the filtered characters
     */
    private _setCounter = (filtered: number) => {
        this.counter = `Filtered: ${filtered} Read: ${this.readCharacters.length} \
            Total: ${this.totalCharacters}`;
    };
}
