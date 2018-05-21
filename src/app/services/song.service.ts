import { Song } from '../models/song';
import { Http, Request, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

// import { Socket } from 'ngx-socket-io';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { YoutubeService } from './youtube.service';

declare const Pusher: any;

@Injectable()
export class SongService {
    public songs: Array<Song> = new Array<Song>();
    public waitingTime: number;
    public isBaseUrlCorrect = false;

    public baseUrl: string = localStorage.getItem('baseUrl');
    private readonly songRoute: string = '/song';
    private readonly playlistRoute: string = '/playlist';
    private readonly volumeRoute: string = '/volume';
    private readonly autoPlayRoute: string = '/autoplay';
    private readonly waitingTimeRoute: string = '/waiting-time';
    private readonly nextSongRoute: string = '/next-song';
    private readonly internalIpRoute: string = '/internal-ip';
    private readonly timePosRoute: string = '/time-pos';
    private readonly remaingTimeRoute: string = '/remaining-time';
    private readonly isAdminRoute: string = '/is-admin';

    public alreadyAdded = false;

    public isFirst = true;

    public videoIds = [];
    public images = [];
    public titles = [];
    public durations = [];
    public canAddNewSong = true;

    public progress: number;

    public newSong: Song;

    public remainingTime = 0;

    public autoPlay: boolean;

    public privateChannel: any;

    public isAdmin = false;

    private pusher;
    public broadcastChannel;

    constructor(
        private http: Http,
        private youtubeService: YoutubeService) {

        this.http.get(this.baseUrl + this.isAdminRoute).subscribe(data => {
                this.isAdmin = true ? data.text() === 'True' : false;
            }
        );

        this.getWaitingTime().subscribe(
            data => {
                this.waitingTime = data.json().value;
                this.isBaseUrlCorrect = true;
            },
            error => {
                this.waitingTime = 0;
                this.isBaseUrlCorrect = false;
            }
        );

        if (this.isAdmin) {
            this.getWaitingTime().subscribe(
                data => {
                    this.waitingTime = data.json().value;
                }
            );
        }

        this.pusher = new Pusher('6a7effbefd9dc9098aff', {
            cluster: 'eu',
            encrypted: true
        });

        Pusher.logToConsole = true;

        this.broadcastChannel = this.pusher.subscribe('broadcast');

        console.log('song service constructor');
    }

    sendPostSong(index: number) {
        this.newSong = new Song(
            this.youtubeService.titles[index],
            this.youtubeService.videoIds[index],
            this.youtubeService.images[index],
            this.youtubeService.durations[index]
        );
        this.postSong(this.newSong).subscribe(
            data => {
                this.canAddNewSong = true;
            },
            error => {
                if (error.status === 409) {
                    this.alreadyAdded = true;
                } else if (error.status === 429) {
                    this.canAddNewSong = false;
                }
            }
        );
    }

    getTimePosChanged() {
        this.broadcastChannel.bind('time-pos-changed', data => {
            this.progress = data.message;
        });
        // this.socket.on("timePosChanged", data => this.progress = data);
    }

    getRemainingTimeChanged() {
        this.http.get(this.baseUrl + this.internalIpRoute).subscribe(
            data => {
                console.log(data.text());
                this.privateChannel = this.pusher.subscribe(data.text());
                this.privateChannel.bind('remaining-time-changed', data2 => {
                    this.remainingTime = data2.remainingTime;
                });
            }
        );
    }

    getWaitingTimeChanged() {
        this.broadcastChannel.bind('waiting-time-changed', waitingTime => {
            this.waitingTime = waitingTime.value;
        });
    }

    getRemainingTime() {
        this.http.get(this.baseUrl + this.remaingTimeRoute).subscribe(data => {
            this.remainingTime = +data.text();
            console.log(this.remainingTime);
        });
    }

    getTimePos() {
        this.http.get(this.baseUrl + this.timePosRoute).subscribe(
            data => this.progress = +data.text()
        );
    }

    setWaitingTime(waitingTime: number) {
        return this.http.put(this.baseUrl + this.waitingTimeRoute, { 'value': waitingTime });
    }

    getWaitingTime() {
        return this.http.get(this.baseUrl + this.waitingTimeRoute);
    }

    getNextSong() {
        return this.http.get(this.baseUrl + this.nextSongRoute);
    }

    postSong(song: Song) {
        return this.http.post(this.baseUrl + this.songRoute, song);
    }

    deleteSong(youtubeId: string) {
        return this.http.delete(this.baseUrl + this.songRoute,
            new RequestOptions({ body: { 'youtubeId': youtubeId } }));
    }

    getPlaylist() {
        return this.http.get(this.baseUrl + this.playlistRoute);
    }

    getVolume() {
        return this.http.get(this.baseUrl + this.volumeRoute);
    }

    setVolume(volume: number) {
        return this.http.put(this.baseUrl + this.volumeRoute, { 'value': volume });
    }

    setAutoPlay(autoPlay: boolean) {
        return this.http.put(this.baseUrl + this.autoPlayRoute, { 'value': autoPlay });
    }

    getAutoPlay() {
        return this.http.get(this.baseUrl + this.autoPlayRoute);
    }

}
