import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, Signal, SimpleChanges, WritableSignal, signal } from '@angular/core';
import { NgFor, NgIf, NgStyle,  } from '@angular/common';
import { ICharacter } from 'src/domain/model/ICharacter';
import { CharactersService } from 'src/domain/services/characters.service';
import { CardComponent } from "../../infrastructure/components/card/card.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';

const showScrollHeight = 400;
const hideScrollHeight = 200;

@Component({
    selector: "app-characters",
    standalone: true,
    templateUrl: "./characters.component.html",
    styleUrls: ["./characters.component.scss"],
    imports: [NgFor, NgIf, NgStyle, CardComponent, InfiniteScrollModule],
})
export class CharactersComponent {
    // private loading = false;
    private totalCharacters = 0;
    protected isFiltering = false;
    protected characters: ICharacter[] = [];
    protected showGoUpButton = false;
    protected loading = false;
    private element!: HTMLDivElement;
    //protected height = signal("0");
    protected hasScroll = false;
    private lastTop = 0;
    last = "";
    // private _height$!: Observable<number>;
    // @Input() set height$(v: Observable<number>) {
    //     console.log("BBBB", v);
    //     if (v != undefined && this._height$ == undefined) this._height$ = v;

    //     this._height$.subscribe(val => {
    //         this.last = val.toFixed(0);
    //         console.log("VAL", val);
    //         setTimeout(() => {
    //             if (val.toFixed(0) == this.last) {
    //                 //this.height.set(this.last + "px");
    //                 this.element.style.height = this.last + "px";
    //                 //console.log("QQQQQQQQQQ", this.height());
    //             }
    //         }, 200);
    //     });
    // }
    protected _headerHeight = signal(0);
    @Input() set headerHeight(v: number) {
        //this.element.style.height = v() + "px";
        this._headerHeight.set(v);
        console.log("HH", this._headerHeight());
    }
    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (
            (window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop) > showScrollHeight
        ) {
            this.showGoUpButton = true;
        } else if (
            this.showGoUpButton &&
            (window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop) < hideScrollHeight
        ) {
            this.showGoUpButton = false;
        }

        const elem = document.scrollingElement as HTMLElement;
        const margin = elem.scrollHeight / 10;
        if (elem.scrollHeight - elem.scrollTop <= elem.offsetHeight + 50 &&
            this.charactersService.getNextPage()) {
            //if (elem.scrollHeight / elem.scrollTop > 3)
                setTimeout(() => (elem.scrollTop -= margin), 100);
        }
    }

    constructor(
        private charactersService: CharactersService,
        private host: ElementRef<HTMLElement>,

    ) {}

    ngOnInit(): void {
        this.charactersService.filteredCharacters.subscribe(resp => {
            if (resp.length > this.totalCharacters)
                this.totalCharacters = resp.length;

            this.isFiltering = resp.length < this.totalCharacters;

            this.characters = resp;
        });
        this.charactersService.getCharacters();
        this.element = this.host.nativeElement.getElementsByClassName(
            "cls-margin-top"
        )[0] as HTMLDivElement;
    }

    onScroll() {
        if (this.loading) return;
        console.log("TTTHHHH", this._headerHeight());
        if (this.charactersService.getNextPage())
            this.charactersService.getCharacters();
        else console.log("No more pages!");
    }

    scrollTop() {
        window.scrollY = 0;
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Other
    }
}
