import { Injectable } from '@angular/core';
import { CharactersRepoService } from 'src/infrastructure/repositories/characters-repo.service';
import { ICharacter } from '../model/ICharacter';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class CharactersService {
    private _characters: ICharacter[] = [];

    private _totalCharacters = 0; // Updated every time characters are obtained.
    get totalCharacters() {
        return this._totalCharacters;
    }

    private _nextPage: string | null = "1"; // Next page number
    get nextPage() {
        return this._nextPage;
    }

    private _characters$ = new Subject<ICharacter[]>(); // Total characters obtained
    get characters$() {
        return this._characters$;
    }

    private _filteredCharacters$ = new Subject<ICharacter[]>(); // Filtered characters
    get filteredCharacters$() {
        return this._filteredCharacters$;
    }

    private _loading = false; // Reading from repository
    get loading() {
        return this._loading;
    }

    constructor(private charactersRepo: CharactersRepoService) {}

    /**
     * Gets the next page of characters from the repository
     *
     */
    getCharacters() {
        if (this.nextPage == null || this.loading) return;

        this._loading = true;

        this.charactersRepo.getCharacters({ page: this.nextPage }).subscribe({
            next: resp => {
                const next = resp.data[0].info.next;

                this._totalCharacters = resp.data[0].info.count;
                this._nextPage = next == null ? null : this.getPage(next); // Gets new data page from the next url
                this._characters.push(...resp.data[0].results); // Add new characters to those already obtained.
                this._characters$.next(this._characters); // The Observable (Subject) 'characters$' emits the new values
            },
            error: err => console.log(err),
            complete: () => (this._loading = false),
        });
    }

    /**
     * Enter new values in the Observable (Subject) 'filteredCharacters$'
     *
     * @param characters Array of characters filtered by name from the header component
     */
    setFilteredCharacters(characters: ICharacter[]): void {
        this._filteredCharacters$.next(characters);
    }

    /**
     *
     * @param url URL string from which to get the page query parameter
     * @returns The page number as a string or null if not found
     */
    private getPage = (url: string) => url.split("?page=").pop() ?? null;
}
