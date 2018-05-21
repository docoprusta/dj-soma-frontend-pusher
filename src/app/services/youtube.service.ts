import { Observable } from "rxjs/Observable";
import { Song } from "../models/song";
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class YoutubeService {

    public videoIds = [];
    public images = [];
    public titles = [];
    public durations = [];

    private cache = [];

    public checked: boolean = true;

    inputString: string;

    constructor(private http: Http) { }

    getDuration(youtubeId: string) {
        const url = "https://www.googleapis.com/youtube/v3/videos";
        return this.http
            .get(url, {
                params: {
                    id: youtubeId,
                    part: "contentDetails",
                    key: "AIzaSyDnXC_k6YB-A8H4GC3swaqO7lzFXPQGjTQ"
                }
            })
    }

    searchSongs(term: string) {
        this.inputString = term;
        const url = "https://www.googleapis.com/youtube/v3/search";
        return this.http
            .get(url, {
                params: {
                    q: term,
                    part: "snippet",
                    maxResults: 20,
                    key: "AIzaSyDnXC_k6YB-A8H4GC3swaqO7lzFXPQGjTQ"
                }
            })
    }

    populateResults(results): void {
        this.clearEveryArray();

        if (this.inputString && !this.isCached()) {
            this.populateEveryArray(results);
            this.addResultsToCache();
        } else if (this.inputString) {
            const itemFromCache = this.cache.find((item) => item.searched === this.inputString)
            this.removeDuplicatesFromEveryArray(itemFromCache);
        }
    }

    YoutubeDurationToSeconds(duration: string): number {
        var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        match = match.slice(1).map(function (x) {
            if (x != null) {
                return x.replace(/\D/, '');
            }
        });

        var hours = (parseInt(match[0]) || 0);
        var minutes = (parseInt(match[1]) || 0);
        var seconds = (parseInt(match[2]) || 0);

        return hours * 3600 + minutes * 60 + seconds;
    }

    populateEveryArray(results) {
        results.items.forEach(element => {
            if (this.isResultContainsEveryData(element)) {
                this.getDuration(element.id.videoId)
                    .subscribe(data => {
                        const responseJson = data.json();
                        const duration = this.YoutubeDurationToSeconds(responseJson.items[0].contentDetails.duration);
                        if (duration < 600 && duration > 0) {
                            this.durations.push(duration);
                            this.titles.push(element.snippet.title);
                            this.videoIds.push(element.id.videoId);
                            this.images.push(element.snippet.thumbnails.medium.url);
                        }
                    });
            }
        });
    }

    addResultsToCache(): void {
        this.cache.push({
            "searched": this.inputString,
            "titles": this.titles,
            "videoIds": this.videoIds,
            "images": this.images,
            "durations": this.durations
        });
    }

    isCached(): boolean {
        return this.cache.findIndex((item) => item.searched === this.inputString) !== -1;
    }

    isResultContainsEveryData(element): boolean {
        return element.snippet.title !== undefined &&
            element.id.videoId !== undefined &&
            element.snippet.thumbnails.medium.url != undefined;
    }

    removeDuplicatesFromEveryArray(itemFromCache) {
        this.titles = this.removeDuplicatesFromArray(itemFromCache.titles);
        this.videoIds = this.removeDuplicatesFromArray(itemFromCache.videoIds);
        this.images = this.removeDuplicatesFromArray(itemFromCache.images);
        this.durations = this.removeDuplicatesFromArray(itemFromCache.durations);
    }

    removeDuplicatesFromArray(array: Array<any>) {
        return array.filter((item, index, array) => array.indexOf(item) == index);
    }

    clearEveryArray(): void {
        this.titles = [];
        this.videoIds = [];
        this.images = [];
        this.durations = [];
    }
}