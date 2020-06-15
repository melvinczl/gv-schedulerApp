import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { environment } from '../../environments/environment';
import { IStream } from './stream';

@Injectable()
export class IPStreamService {
    private _streamUrl = environment.apiUrl + '/channels';

    constructor(private _http: HttpClient) {}

    getStreams(deviceID?: string): Observable<IStream[]> {
        let obsStreams: Observable<IStream[]>;

        obsStreams = this._http.get(this._streamUrl)
            .catch(this.handleError);

        if(deviceID != undefined) {
            obsStreams = obsStreams
                .map(streams => streams
                    .filter(s => s.device === deviceID))
                .catch(this.handleError);
        }

        return obsStreams;
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
}