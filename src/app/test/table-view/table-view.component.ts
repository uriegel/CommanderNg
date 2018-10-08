import { Component, OnInit } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent, IColumns } from '../../columns/columns.component'
import { Item } from '../../model/model'

@Component({
  selector: 'app-test-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

    columns: IColumns = {
        name: "Columns",
        columns: [
            { name: "Name", isSortable: true },
            { name: "Erw.", isSortable: true },
            { name: "Datum", isSortable: true },
            { name: "Größe" },
            { name: "Version", isSortable: true }
        ]            
    }
    path = "c:\\windows\\system32"
    items: Observable<Item[]> 

    ngOnInit() {
        this.items = this.readDirectory1()
    }

    private readDirectory1 = this.getReadDirectory("c:\\windows\\system32")
    private readDirectory2 = this.getReadDirectory("c:\\")

    onNeu() {
        this.path = "c:\\windows\\system32"
        this.items = this.readDirectory1()
        const subscription = this.items.subscribe({ 
            next: value => {
                // const index = value.findIndex(n=> (n as FileItem).name.toLowerCase() == "recovery")
                // if (index != -1) {
                //     value[0].isCurrent = false 
                //     value[index].isCurrent = true
                // }
                // subscription.unsubscribe()
            }
        })
    }

    onChange() {
        this.path = "c:"
        this.items = this.readDirectory2()
    }

    private getReadDirectory(path: string) {
        return null
        // let fileItems: FileItem[]

        // const readDirectoryPromise = (): Promise<FileItem[]> => {
        //     return new Promise((res, rej) => {
        //         if (fileItems) 
        //             res(fileItems)
        //         else
        //             this.addon.readDirectory(path, (err, result) => {
        //                 res(result)
        //             })
        //     })
        // }

        // const readDirectory = () => from(readDirectoryPromise())
        // return readDirectory
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }
}
