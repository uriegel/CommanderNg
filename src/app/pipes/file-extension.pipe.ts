import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'fileExtension'
})
export class FileExtensionPipe implements PipeTransform {
    transform(name: string) {
        var pos = name.lastIndexOf('.')
        return pos != -1 ? name.substring(pos) : ""
    }
}
