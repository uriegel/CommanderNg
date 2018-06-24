import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'date'
})
export class DatePipe implements PipeTransform {

    transform(date: Date) {
        return DatePipe.dateFormat.format(date) + " " + DatePipe.timeFormat.format(date)
    }

    private static readonly dateFormat = Intl.DateTimeFormat("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
    
    private static readonly timeFormat = Intl.DateTimeFormat("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    })
}
