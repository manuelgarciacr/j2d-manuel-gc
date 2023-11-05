import { Injectable, inject } from "@angular/core";
import { IHttpAdapter, Params } from "../adapters/IHttpAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { ICharacter } from "src/domain/model/ICharacter";
import { IResponse } from "src/domain/model/IResponse";

@Injectable({
    providedIn: "root",
})
export class CharactersRepoService {
    private dataSource: IHttpAdapter<IResponse<ICharacter>>;

    constructor() {
        // All Http adapters must implement IHttpAdapter
        // It is possible to change the connection technology to another such
        //   as XMLHttpRequest, fetch, Axios, etc. and I would only need
        //   modify the HttpAdapter.
        this.dataSource = inject(HttpAdapter<IResponse<ICharacter>>);
        // URL obtained from environment variables.
        this.dataSource.url = `${environment.url}character/`;
    }

    getCharacters = (arg?: string | Params) => this.dataSource.get(arg);
}
