import { Directive, ElementRef, HostListener, Input } from '@angular/core'
import { NoFileExtensionPipe } from '../pipes/no-file-extension.pipe';

@Directive({
    selector: '[appSelectAll]'
})
export class SelectAllDirective {

    @Input() selectNameOnly = false

    @HostListener("focus") 
    @HostListener("click") 
    onFocus() {
        if (this.initial) {
            this.initial = false
            if (this.selectNameOnly) {
                const input = this.el.nativeElement as HTMLInputElement
                const noFileExtensionPipe = new NoFileExtensionPipe()
                const name = noFileExtensionPipe.transform(input.value)
                input.setSelectionRange(0, name.length)
                return
            }
        }

        (this.el.nativeElement as HTMLInputElement).select()
    }

    constructor(private el: ElementRef) { }

    private initial = true
}
