import { Observable, catchError, map, of, retry, timer } from "rxjs";
import { IDataAdapter, Params, resp } from "./IDataAdapter";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
        //Authorization: 'my-auth-token',
    }),
    observe: "body" as const, // 'body' | 'events' | 'response',
    params: {},
    reportProgress: false,
    responseType: "json" as const,
    withCredentials: false,
};

@Injectable()
export class HttpAdapter<T> implements IDataAdapter<T> {
    private http = inject(HttpClient);
    url = "";
    //private http: HttpClient;
    // url = "";

    constructor() {
        //this.http = inject(HttpClient);
    }

    // get = (): Observable<resp<T>> =>
    //     this.http.get<T>(this.url, httpOptions).pipe(
    //         map(res => {
    //             const res2: resp<T> = {
    //                 status: 3, //res.status,
    //                 message: "msg", //res.message,
    //                 data: [res],
    //             };
    //             return res2; // kind of useless
    //         }),
    //         retry({ count: 2, delay: this.shouldRetry }),
    //         catchError(this.handleError<T>("http get"))
        // );
    get = (arg?: string | Params): Observable<resp<T>> => {
        let params = new HttpParams(); // Query params
        let url = this.url;

        if (typeof arg == "string") url += `/${arg}`;
        else if (typeof arg == "object") params = params.appendAll(arg);
        else if (typeof arg != "undefined")
            throw new Error("Get param is invalid");

        return this._get(url, params);
    };

    private _get = (url: string, params: HttpParams) =>
        this.http.get<T>(url, { ...httpOptions, params }).pipe(
            map(res => {
                const res2: resp<T> = {
                    status: 3, //res.status,
                    message: "msg", //res.message,
                    data: [res],
                };
                return res2; // kind of useless
            }),
            retry({ count: 2, delay: this.shouldRetry }),
            catchError(this.handleError<T>("http get"))
        );
    // private _get = (url: string, params: HttpParams) =>
    //     this.http
    //         .get<resp<T>>(url, { ...httpOptions, params })
    //         .pipe(
    //             retry({ count: 2, delay: this.shouldRetry }),
    //             catchError(this.handleError<T>("http get"))
    //         );

    // put = (user: T) => {
    //     return this.http
    //         .put<resp<T>>(this.url, user, httpOptions)
    //         .pipe(
    //             retry({ count: 2, delay: this.shouldRetry }),
    //             catchError(this.handleError<T>("http put"))
    //         );
    // };

    // post = (user: T) => {
    //     return this.http
    //         .post<resp<T>>(this.url, user, httpOptions)
    //         .pipe(
    //             retry({ count: 2, delay: this.shouldRetry }),
    //             catchError(this.handleError<T>("http post"))
    //         );
    // };

    // delete = (id: string) => {
    //     return this.http
    //         .delete<resp<T>>(`${this.url}/${id}`, httpOptions)
    //         .pipe(
    //             retry({ count: 2, delay: this.shouldRetry }),
    //             catchError(this.handleError<T>("http delete"))
    //         );
    // };

    private handleError<T>(operation: string) {
        return (error: HttpErrorResponse): Observable<resp<T>> => {
            const status = error.status;
            const message =
                error instanceof HttpErrorResponse
                    ? error.message
                    : (error as Error).message;
            const data = [] as Array<T>;

            console.log(`${operation} failed: ${message}`, error);

            // Let the app keep running by returning a safe result.
            return of({ status, message, data });
        };
    }

    // A custom method to check should retry a request or not
    private shouldRetry(error: HttpErrorResponse) {
        if (error.status != 404) {
            return timer(1000); // Adding a timer from RxJS to return observable<0> to delay param.
        }

        throw error;
    }
}
