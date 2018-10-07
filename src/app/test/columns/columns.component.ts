import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnsComponent as Columns, IColumnSortEvent } from '../../columns/columns.component'

@Component({
    selector: 'app-test-columns',
    templateUrl: './columns.component.html',
    styleUrls: ['./columns.component.css']
})
export class ColumnsComponent implements OnInit {

    constructor() { }

    @ViewChild(Columns) columns: Columns

    ngOnInit() {
        this.columns.columns = {
            name: "Columns",
            columns: [
                { name: "Name", isSortable: true },
                { name: "Erw.", isSortable: true },
                { name: "Datum" },
                { name: "Größe", isSortable: true },
                { name: "Version", isSortable: true },
            ]            
        }
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    onOther() {
        this.columns.columns = {
            name: "Columns2",
            columns: [
                { name: "Datei", isSortable: true },
                { name: "Erweiterung", isSortable: true },
                { name: "Zeit" },
                { name: "Bytes", isSortable: true },
                { name: "Version" },
                { name: "Leerspalte" }
            ]            
        }
    }
}
