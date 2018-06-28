import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { from } from 'rxjs'
import { TableViewComponent as TableView, IItem } from '../../table-view/table-view.component'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Addon, FileItem } from '../../addon'

@Component({
  selector: 'app-test-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit {

    @ViewChild(TableView) tableView: TableView

    ngAfterViewInit() {
        this.tableView.columns = {
            name: "Columns",
            columns: [
                { name: "Name", isSortable: true },
                { name: "Erw.", isSortable: true },
                { name: "Datum", isSortable: true },
                { name: "Größe" },
                { name: "Version", isSortable: true }
            ]            
        }

        this.tableView.path = "c:\\windows\\system32"
        this.tableView.items = this.readDirectory1()
    }

    private readDirectory1 = this.getReadDirectory("c:\\windows\\system32")
    private readDirectory2 = this.getReadDirectory("c:\\")

    private onNeu() {
        this.tableView.path = "c:\\windows\\system32"
        this.tableView.items = this.readDirectory1()
        const subscription = this.tableView.items.subscribe({ 
            next: value => {
                const index = value.findIndex(n=> (n as FileItem).name.toLowerCase() == "recovery")
                if (index != -1) {
                    value[0].isCurrent = false 
                    value[index].isCurrent = true
                }
                subscription.unsubscribe()
            }
        })
    }

    private onChange() {
        this.tableView.path = "c:"
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
                        res(result)
                    })
            })
        }

        const readDirectory = () => from(readDirectoryPromise())
        return readDirectory
    }

    private onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    private readonly addon: Addon = (<any>window).require('addon')
}
