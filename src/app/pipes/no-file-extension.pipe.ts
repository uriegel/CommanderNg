import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'noFileExtension'
})
export class NoFileExtensionPipe implements PipeTransform {
    transform(name: string) {
        var pos = name.lastIndexOf('.');
        return pos != -1 ? name.substring(0, pos) : name
    }
}
