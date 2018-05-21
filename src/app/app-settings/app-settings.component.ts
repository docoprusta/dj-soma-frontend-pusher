import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
  @ViewChild('baseUrlInput') baseUrlInput: ElementRef;
  @ViewChild('waitingTimeInput') waitingTimeInput: ElementRef;

  constructor(private router: Router, public songService: SongService) { }

  ngOnInit() {
    this.baseUrlInput.nativeElement.value = localStorage.getItem('baseUrl');
    this.songService.getWaitingTimeChanged();
  }

  onWaitingTimeInputKeyUp() {
    if (this.waitingTimeInput.nativeElement.value) {
      this.songService.setWaitingTime(this.waitingTimeInput.nativeElement.value).subscribe();
    }
  }

  onSaveClick() {
    localStorage.setItem('baseUrl', this.baseUrlInput.nativeElement.value);

    if (this.waitingTimeInput.nativeElement.value) {
      this.songService.setWaitingTime(this.waitingTimeInput.nativeElement.value).subscribe();
    }

    this.songService.getWaitingTime().subscribe(data => {
      this.router.navigateByUrl('/');
    });
  }

  onBaseUrlKeyUp() {
    localStorage.setItem('baseUrl', this.baseUrlInput.nativeElement.value);
    this.songService.baseUrl = this.baseUrlInput.nativeElement.value;
    this.songService.getWaitingTime().subscribe(
      data => {
        this.songService.waitingTime = data.json().value;
        this.songService.isBaseUrlCorrect = true;
      },
      error => {
        this.songService.waitingTime = 0;
        this.songService.isBaseUrlCorrect = false;
      }
    );
  }

}
