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
        this.tableView.items = this.readDirectory1()
    }

    private readDirectory1 = this.getReadDirectory("c:\\windows\\system32\\")
    private readDirectory2 = this.getReadDirectory("c:\\")

    private onNeu() {
        this.tableView.items = this.readDirectory1()
    }

    private onChange() {
        this.tableView.items = this.readDirectory2()
    }

    private getReadDirectory(path: string) {
        let fileItems: FileItem[]

        const readDirectoryPromise = (): Promise<FileItem[]> => {
            return new Promise((res, rej) => {
                if (fileItems) 
                    res(fileItems)
                else
                    this.addon.readDirectory(path, (err, result) => {
                        fileItems = result
                        res(result)
                    })
            })
        }

        const readDirectory = () => from(readDirectoryPromise())
        return readDirectory
    }



    private readonly addon: Addon = (<any>window).require('addon')
}
