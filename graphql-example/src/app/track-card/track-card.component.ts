import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FullTrack, Track } from '../models/track.model'

@Component({
  selector: 'track-card',
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.css']
})
export class TrackCardComponent implements OnInit {
  @Input() track: Track
  @Input() fullTrack: FullTrack

  constructor() { }

  ngOnInit(): void {
  }

  getJsonTrack() {
    return JSON.stringify(this.track, null, ' ');
  }

  getFullJsonTrack(){
    return JSON.stringify(this.fullTrack, null, ' ');
  }

  getTrackImg(){
    return this.track.album.image.url;
  }

  getTrackTitle(){
    return this.track.name;
  }

  getTrackAlbumTitle(){
    return this.track.album.label;
  }

  getTrackReleaseDate(){
    return this.track.album.release_date.split('-')[0];
  }
}
