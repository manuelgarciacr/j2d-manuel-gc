import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICharacter } from 'src/domain/model/ICharacter';
import { CharactersRepoService } from 'src/infrastructure/repositories/characters-repo.service';
import { CharactersService } from 'src/domain/services/characters.service';

@Component({
    selector: "app-characters",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./characters.component.html",
    styleUrls: ["./characters.component.scss"],
})
export class CharactersComponent {
    // private loading = false;
    protected characters: ICharacter[] = [];

    constructor(private charactersService: CharactersService) {}

    ngOnInit(): void {
        this.charactersService.characters.subscribe(resp => {
            this.characters = resp.reverse();
        });
        this.charactersService.getCharacters();
    }

    protected more = () => this.charactersService.getCharacters();
    // getCharacters(): void {
    //     this.loading = true;
    //     this.charactersService.getCharacters().subscribe(resp => {
    //         this.characters.push(...resp.data[0].results);
    //         //this.nextPage = resp.body?.next || null;
    //         this.loading = false;
    //     });
    //}
}
