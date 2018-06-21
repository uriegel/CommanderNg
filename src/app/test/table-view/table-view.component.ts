import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { from } from 'rxjs'
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

    ngAfterViewInit() {
        this.tableView.items = this.readDirectory("c:\\")
    }

    private onNeu() {
        this.tableView.items = this.readDirectory("c:\\windows\\")
    }

    private readDirectory(path: string) {
        return from(this.readDirectoryPromise(path))
    }

    private readDirectoryPromise(path: string): Promise<FileItem[]> {
        return new Promise((res, rej) => this.addon.readDirectory(path, (err, result) => res(result)))
    }

    private readonly addon: Addon = (<any>window).require('addon')
}
