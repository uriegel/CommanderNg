import { Component, OnInit, Input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Item } from '../../table-view/table-view.component'
import { FileHelperService } from '../../providers/file-helper.service'
import { TouchBarSlider } from 'electron';

@Component({
    selector: '[app-file-item]',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

    @Input()
    Item: Item

    private basePath = "c:\\windows"

    get Name() {
        return this.fileHelper.getNameOnly(this.Item.name)    
    }

    get Ext() {
        return this.fileHelper.getExtension(this.Item.name)
    }

    get Icon() {
        return this.sanitizer.bypassSecurityTrustUrl(`icon://${(this.Ext == ".exe" ? this.basePath + "\\" + this.Item.name : this.Ext)}`)
    }

    get Date() {
        return this.fileHelper.formatDate(this.Item.time)
    }
    
    get Size() {
        return this.fileHelper.formatFileSize(this.Item.size)
    }

    constructor(private fileHelper: FileHelperService, private sanitizer: DomSanitizer) {}

    ngOnInit() { }
}
