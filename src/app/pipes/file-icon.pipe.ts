import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
    name: 'fileIcon'
})
export class FileIconPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(name?: string, basePath?: string): any {
        var pos = name.lastIndexOf('.')
        var ext = pos != -1 ? name.substring(pos) : null
        if (ext) {
            if (ext.toLowerCase() == ".exe")
                return this.sanitizer.bypassSecurityTrustUrl(`icon://${basePath}\\${name}`)
            else
                return this.sanitizer.bypassSecurityTrustUrl(`icon://${ext}`)                
        }
        else
            return null
    }
}
