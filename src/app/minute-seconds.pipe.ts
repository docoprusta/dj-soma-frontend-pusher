import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        const seconds: number = (value - minutes * 60);
        let minutesStr: string;
        let secondsStr: string;

        if ((minutes+"").length == 1) {
            minutesStr = '0' + minutes;
        } else {
            minutesStr = minutes + "";
        }

        if ((seconds+"").length == 1) {
            secondsStr = '0' + (value - minutes * 60);
        } else {
            secondsStr = seconds + "";
        }

        return minutesStr + ':' + secondsStr;
    }

}