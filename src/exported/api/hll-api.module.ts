import { NgModule } from '@angular/core';
import { TrackHttpClient } from './track.http';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    TrackHttpClient
  ]
})
export class HllApiModule { }
