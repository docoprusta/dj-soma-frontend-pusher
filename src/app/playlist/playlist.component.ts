import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SongService } from '../services/song.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DatePipe } from '@angular/common';
import { MinuteSecondsPipe } from '../minute-seconds.pipe';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})


export class PlaylistComponent implements OnInit {
  private playlist;
  public volume: number;
  constructor(
    public songService: SongService,
    private spinnerService: Ng4LoadingSpinnerService) {}

  private alreadyAdded: boolean;

  populateSongs() {
    this.spinnerService.show();

    this.songService.getPlaylist().subscribe(response => {
      this.songService.videoIds = [];
      this.songService.images = [];
      this.songService.titles = [];
      this.songService.durations = [];
      this.songService.progress = 0;

      this.playlist = response.json();
      this.playlist.forEach(element => {
        this.songService.videoIds.push(element.youtubeId);
        this.songService.images.push(element.imageUrl);
        this.songService.titles.push(element.title);
        this.songService.durations.push(element.duration);
      });
    });
    this.spinnerService.hide();
  }

  onVolumeChange() {
    this.songService.setVolume(this.volume).subscribe(data => {});
  }

  autoPlayCheckboxChanged() {
    this.songService.setAutoPlay(this.songService.autoPlay).subscribe();
  }

  onNextSong() {
    this.spinnerService.show();
    this.songService.getNextSong().subscribe(data => {
      this.spinnerService.hide();
    });
  }

  ngOnInit() {

    this.populateSongs();

    this.songService.isFirst = false;

    setTimeout(() => {
      this.songService.canAddNewSong = true;
    }, 5000);

    setTimeout(() => {
      this.songService.alreadyAdded = false;
    }, 5000);

    this.songService.getRemainingTimeChanged();

    this.songService.getWaitingTimeChanged();

    this.songService.getTimePosChanged();

    this.songService.getTimePos();

    this.songService.getRemainingTime();

    this.songService.broadcastChannel.bind('song-ended', data => {
      this.populateSongs();
    });

    this.songService.getVolume().subscribe(data => {
      this.volume = data.json().volume;
    });

    this.songService.broadcastChannel.bind('volume-changed', data => {
      this.volume = +data.value;
    });

    this.songService.broadcastChannel.bind('next-song-added', data => {
      this.populateSongs();
    });

    this.songService.getAutoPlay().subscribe(data => {
      this.songService.autoPlay = !!data.json().value;
    });


    this.songService.broadcastChannel.bind('song-deleted', data => {
      this.populateSongs();
    });

    this.songService.broadcastChannel.bind('autoplay-changed', data => {
      this.songService.autoPlay = !!data.value;
    });


    this.songService.broadcastChannel.bind('song-added', data => {
      console.log(data);
      if (!this.songService.videoIds.includes(data.youtubeId)) {
        this.songService.videoIds.push(data.youtubeId);
        this.songService.titles.push(data.title);
        this.songService.images.push(data.imageUrl);
        this.songService.durations.push(data.duration);
      }
    });
  }

  onDelete(index: number) {
    this.songService.deleteSong(this.songService.videoIds[index]).subscribe(
      data => console.log(data)
    );
  }
}
