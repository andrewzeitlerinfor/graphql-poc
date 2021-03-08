import { Component, NgModule, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { FullTrack, Track } from './models/track.model'
import { HttpClient } from '@angular/common/http'

const TOP_TRACKS = gql`
  query GetTracks($amount: Int!) {
    topTracks(amount: $amount) {
      id
      name
      album {
        id
        label
        release_date
        image {
          height
          width
          url
        }
      }
    }
  }
`

const TOP_FULL_TRACKS = gql`
  query GetTracks($amount: Int!) {
    topTracks(amount: $amount) {
      id
      name
      album {
        id
        label
        release_date
        image {
          height
          width
          url
        }
      }
      disc_number
      duration_ms
      explicit
      href
      is_local
      is_playable
      popularity
      preview_url
      track_number
      type
      uri
    },
    topArtists{
      ...
    }
  }
`

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'graphql-example';
  tracks: Track[] = [];
  fullTracks: FullTrack[] = []
  tracks$: Observable<any>;
  apollo: Apollo;
  http: HttpClient;

  constructor(apollo: Apollo, http: HttpClient){
    this.apollo = apollo;
    this.http = http;
  }

  getTracks(trackAmount: number){
    return this.apollo.watchQuery({
      query: TOP_TRACKS,
      variables: {
        amount: trackAmount
      }
    }).valueChanges
  }

  getFullTracks(trackAmount: number){
    return this.apollo.watchQuery({
      query: TOP_FULL_TRACKS,
      variables: {
        amount: trackAmount
      }
    }).valueChanges
  }

  ngOnInit(){
    this.getFullTracks(10).subscribe(result => this.fullTracks = result.data['topTracks'] as FullTrack[])
    this.tracks$ = this.getTracks(10).pipe();
    this.tracks$.subscribe(result => this.tracks = result.data['topTracks'] as Track[]);
  }

  logout() {
    this.apollo.mutate({
      mutation: LOGOUT
    }).subscribe(
      result => {
        window.location.href = 'http://localhost:4000';
      });
  }

  trackAmountChange(event: any){
    console.log(event.srcElement.value);
    let trackAmount = event.srcElement.value;
    console.log(trackAmount)
    if(trackAmount > 0){
      this.getFullTracks(parseInt(trackAmount)).subscribe(result => this.fullTracks = result.data['topTracks'] as FullTrack[])
      this.tracks$ = this.getTracks(parseInt(trackAmount)).pipe();
      this.tracks$.subscribe(result => this.tracks = result.data['topTracks'] as Track[]);
    }
  }
}
