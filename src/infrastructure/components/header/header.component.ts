import { Component, ElementRef, EventEmitter, HostListener, Output, ViewContainerRef } from '@angular/core';
import { AsyncPipe, NgFor, NgOptimizedImage } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
    @Output() public heightEvent: EventEmitter<Observable<number>> =
        new EventEmitter();
    @Output() public heightEv: EventEmitter<number> = new EventEmitter();
    protected nameCtrl = new FormControl("");
    protected options: ICharacter[] = [];
    protected filteredOptions!: Observable<ICharacter[]>;
    protected filteredNames!: Observable<string[]>;
    protected counter = "";
    protected isPanelOpened = false;
    private height$ = new Observable<number>(observer => {
        const element = this.host.nativeElement.firstChild;
        const heightObserver = new ResizeObserver(entries => {
            const height = entries[0].contentRect.height;
            observer.next(height);
        });
        heightObserver.observe(element);
        // When the consumer unsubscribes, clean up data ready for next subscription.
        return {
            unsubscribe() {
                heightObserver.unobserve(element);
            },
        };
    });

    constructor(
        private charactersService: CharactersService,
        private host: ElementRef
    ) {}

    ngOnInit() {
        this.heightEvent.emit(this.height$);
        const element = this.host.nativeElement.firstChild;
        const heightObserver = new ResizeObserver(entries => {
            const height = entries[0].contentRect.height;
            console.log("EMEM", height);
            this.heightEv.emit(height);
        });
        heightObserver.observe(element);
        this.charactersService.characters.subscribe(resp => {
            this.options = resp;
            this.nameCtrl.clearAsyncValidators();
            this.nameCtrl.updateValueAndValidity();

            // const filtered = this._filter(this.nameCtrl.value || "");
            // this.charactersService.setFilteredCharacters(filtered);
            // this.filteredOptions
            // this.counter = filtered.length + " / " + resp.length;
        });
        this.filteredOptions = this.nameCtrl.valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || "")),
            tap(res => this.charactersService.setFilteredCharacters(res)),
            tap(res => console.log("RR", res)),
            tap(
                res => (this.counter = res.length + " / " + this.options.length)
            ),
            //tap(res => {this.filteredNames = of([...new Set(res.map(v => v.name))])})
        );
    }

    private _filter(value: string): ICharacter[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
    }
}
