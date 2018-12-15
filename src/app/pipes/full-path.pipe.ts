import { Pipe, PipeTransform } from '@angular/core'
import { Item } from '../model/model'

@Pipe({
    name: 'fullPath'
})
export class FullPathPipe implements PipeTransform {
    transform(value: Item, path?: string): any {
        console.log("Pfeife", value.items[0])
        return path + "\\" + value.items[0]
    }
}
