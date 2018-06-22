import { Component, AfterViewInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SvgInjectorService } from '../../providers/svg-injector.service'

@Component({
    selector: '[app-directory-item]',
    templateUrl: './directory-item.component.html',
    styleUrls: ['./directory-item.component.css']
})
export class DirectoryItemComponent implements AfterViewInit {

    @ViewChild("img") 
    img: ElementRef

    @Input()
    Item: Item
    
    constructor(private svgInjector: SvgInjectorService, private renderer: Renderer2) { 
        if (!DirectoryItemComponent.folderIcon)
            DirectoryItemComponent.folderIcon = this.svgInjector.getIcon("assets/images/folder.svg")
    }

    ngAfterViewInit() {
        this.svgInjector.replace(this.renderer, this.img.nativeElement, DirectoryItemComponent.folderIcon)
    }

    private static folderIcon 
}
