import { Pipe, PipeTransform } from '@angular/core'
import { Column } from '../model/model'

function getSize(size: string) {
    if (size != "0" && !size)
        return ""
    const len = size.length
    const firstDigits = len % 3

    function getFirstDigits(str: string) {
        if (str.length == 3)
            return str 
        else {
            const first = str.substr(0, 3)
            const last = str.substr(3)
            return `${first}.${getFirstDigits(last)}`
        }
    }
    
    if (len > 3 && firstDigits != 0)
        return `${size.substr(0, firstDigits)}.${getFirstDigits(size.substr(firstDigits))}`
    else if (len > 3 && firstDigits == 0)
        return getFirstDigits(size.substr(firstDigits)) 
    else
        return size
}

@Pipe({
    name: 'item'
})
export class ItemPipe implements PipeTransform {
    transform(value: string, column: Column): any {
        if (column.isDate) {
            if (!value)
                return ""
            const jsdate = new Date(parseInt(value))
            return jsdate.toLocaleString([], {day: '2-digit', month: '2-digit', year:'numeric'}) 
                + " " + jsdate.toLocaleString([], {hour: '2-digit', minute:'2-digit'})
        }
        else if (column.isSize) return getSize(value)
        else return value
    }
}

