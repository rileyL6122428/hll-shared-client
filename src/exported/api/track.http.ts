import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TrackClientConfig {
  urls: {
    upload: string;
    getAllForUser: string;
    delete: (trackId: string) => string;
  };
}

export const trackClientConfigToken = new InjectionToken<TrackClientConfig>('Track-Client-Config');

@Injectable({
  providedIn: 'root'
})
export class TrackHttpClient {

  constructor(
    private httpClient: HttpClient,
    @Inject(trackClientConfigToken) private config: TrackClientConfig
  ) { }

  upload(params: { name: string, contents: File, bearerToken: string }): Observable<any> {
    const payload = new FormData();
    payload.append('audio-file', params.contents, params.name);
    return this.httpClient.post(
      this.config.urls.upload,
      payload,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${params.bearerToken}`
        })
      }
    );
  }

  getTracks(params: { userId: string }): Observable<any> {
    const url = this.config.urls.getAllForUser;
    const options = {
      params: {
        'artist-id': params.userId
      }
    };

    return this.httpClient.get(url, options);
  }

  delete({ track, bearerToken }: { track: { id: string }, bearerToken: string }): Observable<any> {
    return this.httpClient.delete(
      this.config.urls.delete(track.id),
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${bearerToken}`
        })
      }
    )
      .pipe(
        map((response: any) => response.track)
      );
  }

}
