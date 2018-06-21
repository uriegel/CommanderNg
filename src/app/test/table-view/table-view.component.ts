import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { TableViewComponent as TableView, Item } from '../../table-view/table-view.component'

interface FileItem {
    name: string
	isDirectory: boolean
	isHidden: boolean
	size: number
	time: Date
}

interface Addon {
    readDirectory(path: string, callback: (error: any, result: FileItem[]) => void): void
	//getDrives(callback: (error: any, result: DriveInfo[]) => void): void
	getFileVersion(path: string, callback: (error: any, result: string) => void): void
	getExifDate(path: string, callback: (error: any, result: Date) => void): void
}

@Component({
  selector: 'app-test-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit {

    @ViewChild(TableView) tableView: TableView

    constructor() { }

    ngAfterViewInit() {
        const addon: Addon = (<any>window).require('addon')
        addon.readDirectory("c:\\windows\\", (err, result) => {
            this.tableView.items = result
        })
    }
}
