import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'fullPath'
})
export class FullPathPipe implements PipeTransform {

    transform(name: string, path: string): any {
        return path + '\\' + name;
    }
}
