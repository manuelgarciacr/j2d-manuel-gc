import { Injectable } from '@angular/core';
import { CharactersRepoService } from 'src/infrastructure/repositories/characters-repo.service';
import { ICharacter } from '../model/ICharacter';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class CharactersService {
    private _characters = new BehaviorSubject<ICharacter[]>([]);
        get characters() {return this._characters}
    private nextPage: string | null = "1";
    private loading = false;

    constructor(private charactersRepo: CharactersRepoService) {}

    ngOnInit(): void {
        this.getCharacters();
    }

    getCharacters(): void {

        if (this.nextPage == null || this.loading) return;

        this.loading = true;

        this.charactersRepo.getCharacters({page: this.nextPage}).subscribe({
            next: resp => {
                const val = this.characters.getValue();
                const next = resp.data[0].info.next;

                this.nextPage = next == null ? null : this.getPage(next);
    console.log(resp.data[0].info.next, this.nextPage);
                val.push(...resp.data[0].results);
                this._characters.next(val)

            },
            error: err => console.log(err),
            complete: () => this.loading = false
        });
    }

    private getPage = (url: string) =>
        url.split("?page=").pop() ?? null;

}
