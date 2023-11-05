import { Component, ElementRef, HostListener, Input, signal } from '@angular/core';
import { NgFor, NgIf, NgStyle,  } from '@angular/common';
import { ICharacter } from 'src/domain/model/ICharacter';
import { CharactersService } from 'src/domain/services/characters.service';
import { CardComponent } from "../../infrastructure/components/card/card.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatButtonModule } from "@angular/material/button";

const showScrollHeight = 400;
const hideScrollHeight = 200;
const scrollingElement = document.scrollingElement as HTMLElement;

// Displacements of one of the top broken cards on the screen (they are all the same size)
class BrokenTopCard {
    // Displacement in pixels hidden part of the card. If it is greater than the height
    //   of the card, the card is completely hidden. If it is negative, the card is completely
    //   visible. If it is zero, there is no card.
    hidden: number = 0;
    // Displacement in pixels shown part of the card. If it is greater than the height
    //   of the card, the card is completely visible. If it is negative, the card is completely
    //   hidden. If it is zero, there is no card.
    shown: number = 0;
}

@Component({
    selector: "app-characters",
    standalone: true,
    templateUrl: "./characters.component.html",
    styleUrls: ["./characters.component.scss"],
    imports: [
        NgFor,
        NgIf,
        NgStyle,
        CardComponent,
        InfiniteScrollModule,
        MatButtonModule,
    ],
})
export class CharactersComponent {
    private scrollingEnd = false;
    private totalCharacters = 0;
    protected isFiltering = signal(false); // Signal for the isFiltering switch
    protected characters: ICharacter[] = [];
    protected showGoUpButton = false;
    protected hasScroll = false;
    private _headerHeight = signal(0); // Signal for the header height data
    @Input() set headerHeight(v: number) {
        this._headerHeight.set(v + this.remToPixels()); // headerHeight + padding top 1rem
    }
    get headerHeight() {
        return this._headerHeight();
    }
    @HostListener("window:scroll", []) // Sets when the "GO UP" button can be showed
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
    }

    constructor(
        protected service: CharactersService,
        private host: ElementRef<HTMLElement>
    ) {}

    /**
     * Initial hook. At this point the page subscribes to filteredCharacters$
     *   Observable (Subject). From here the header component outputs the filtered data.
     * Second, the application calls the getCharacters() service function to request
     *   data for the first time.
     * And finally we add a listener to the onScrollend event to handle it.
     *
     */
    ngOnInit(): void {
        this.service.filteredCharacters$.subscribe(resp => {
            const firstLoad = this.totalCharacters == 0;

            if (resp.length > this.totalCharacters)
                this.totalCharacters = resp.length;

            this.isFiltering.set(resp.length < this.totalCharacters);
            this.characters = resp;

            if (firstLoad) this.scrollTop();
        });

        this.service.getCharacters();

        addEventListener("scrollend", this.onScrollend);
    }

    /**
     * Infinite scroll directive event. When activated and
     *   data is available, requested
     *
     */
    onScroll() {
        if (this.service.nextPage) {
            this.service.getCharacters();
        } else console.log("No more pages!");

        this.scrollAdjust();
    }

    /**
     * On scroll end, adjust the scroll position
     *
     */
    onScrollend = () => {
        if (this.scrollingEnd) {
            this.scrollingEnd = false;
            return;
        }

        this.scrollAdjust();
        this.scrollingEnd = true;

    };

    /**
     * Adjust the scroll based on the data returned by getTopScreenCard
     *
     */
    private scrollAdjust = () => {
        const cards = this.host.nativeElement.querySelectorAll("mat-card");
        const cardsElements = Array<HTMLElement>();

        cards.forEach(el => cardsElements.push(el as HTMLElement));

        const btc = this.getTopScreenCard(cardsElements);

        if (btc.hidden < 5 || btc.shown < 5)
            // The card is not completely broken or no card
            return;

        // scolls the page up or down
        if (btc.hidden > btc.shown)
            scrollingElement.scrollTop = scrollingElement.scrollTop + btc.shown;
        else
            scrollingElement.scrollTop =
                scrollingElement.scrollTop - btc.hidden;
    };

    /**
     *
     * @param cards An array with the HTMLElements of the filtered cards
     * @returns A BrokenTopCard object: {hidden, shown}
     *
     *   hidden: Displacement in pixels hidden part of the card. If it is greater than the height
     *     of the card, the card is completely hidden. If it is negative, the card is completely
     *     visible. If it is zero, there is no card.
     *
     *   shown: Displacement in pixels shown part of the card. If it is greater than the height
     *     of the card, the card is completely visible. If it is negative, the card is completely
     *     hidden. If it is zero, there is no card.
     *
     *   If hidden and shown are greater than 4, the card is considered
     *     completely broken
     */
    private getTopScreenCard = (cards: HTMLElement[]) => {
        const newTop = scrollingElement.scrollTop + this.headerHeight;
        const cardMargin = 3 * this.remToPixels(); // card.marginTop
        const cardBody = 21 * this.remToPixels(); // card body height
        const cardGap = 1 * this.remToPixels(); // gap under the card
        const cardHeight = cardMargin + cardBody + cardGap;
        const btc = new BrokenTopCard();

        cards.find(card => {
            btc.hidden = newTop - card.offsetTop + cardMargin;
            btc.shown = cardBody - newTop + card.offsetTop + cardGap;

            if (btc.shown >= cardHeight) return true; // The top cards are shown completely. End the search
            if (btc.shown >= 0 && btc.shown < 5) return true; // The top cards are just a little torn. End search
            if (btc.hidden >= 0 && btc.hidden < 5) return true; // The top cards are just a little torn. End search
            if (btc.hidden > 0 && btc.shown > 0) return true; // The top cards are completely broken. End the search

            return false; // Finding
        });

        return btc;
    };

    /**
     *  Scrolls up to the top of the page.
     */
    protected scrollTop = () => {
        window.scrollY = 0;
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Other
    };

    /**
     * Tells the service to download the next page of characters. The Observable (subject)
     *   charactersService.characters$ outputs the values. This function does not return any data.
     *
     */
    protected loadData = () => {
        if (this.service.nextPage) {
            this.service.getCharacters();
        } else console.log("No more pages!");
    };

    /**
     * Returns the current rem font size
     *
     * @returns The number of pixels
     */
    private remToPixels = () =>
        parseFloat(getComputedStyle(document.documentElement).fontSize);
}

