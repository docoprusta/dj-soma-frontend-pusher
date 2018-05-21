import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  @ViewChild("withLyricsCheckbox") withLyricsCheckbox: ElementRef;
  @ViewChild("searchBar") searchBar: ElementRef;
  title = 'app';

  private results: Object;

  constructor(
    private http: Http,
    private router: Router,
    private songService: SongService,
    public youtubeService: YoutubeService
  ) {}

  withLyricsCheckboxChanged() {
    const queryString = this.withLyricsCheckbox.nativeElement.checked ?
      this.searchBar.nativeElement.value + " lyrics" : this.searchBar.nativeElement.value;

    this.youtubeService.searchSongs(queryString).subscribe(results => {
      this.results = results.json();
      this.youtubeService.checked = this.withLyricsCheckbox.nativeElement.checked;
      this.youtubeService.populateResults(this.results);
    });
  }

  onEnter() {
    const queryString = this.withLyricsCheckbox.nativeElement.checked ?
      this.searchBar.nativeElement.value + " lyrics" : this.searchBar.nativeElement.value;

    this.youtubeService.searchSongs(queryString).subscribe(results => {
      this.results = results.json();
      this.youtubeService.checked = this.withLyricsCheckbox.nativeElement.checked;
      this.youtubeService.populateResults(this.results);
    });

    this.searchBar.nativeElement.blur();
  }

  ngOnInit() {
    this.youtubeService.clearEveryArray();
  }

  onBreadCrumbClick(index) {
    this.songService.sendPostSong(index);
    this.router.navigateByUrl('/playlist');
  }

}
