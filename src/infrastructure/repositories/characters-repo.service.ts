import { Injectable, inject } from "@angular/core";
import { IDataAdapter, Params } from "../adapters/IDataAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { ICharacter } from "src/domain/model/ICharacter";
import { IResponse } from "src/domain/model/IResponse";
//import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class CharactersRepoService {
    private dataSource: IDataAdapter<IResponse<ICharacter>>;
    // private _users: IUser[] = [];
    // get users(): IUser[] {
    //     return this._users;
    // }

    constructor() {
        //let a = inject(new HttpAdapter<IUser>());
        this.dataSource = inject(HttpAdapter<IResponse<ICharacter>>);
        this.dataSource.url = `${environment.url}character/`;
    }

    // getUsers = () => {
    //     this.dataSource.get().subscribe(users => {
    //         this._users = users.data;
    //     });
    // }
    getCharacters = (arg?: string | Params) => this.dataSource.get(arg);
    //     putUser = (user: IUser) => this.dataSource.put(user);
    //     addUser = (user: IUser) => this.dataSource.post(user);
    //     deleteUser = (id: string) => this.dataSource.delete(id);
}
