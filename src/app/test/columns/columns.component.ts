import { Component, OnInit, ViewChild } from '@angular/core'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Columns } from 'src/app/model/model';

@Component({
    selector: 'app-test-columns',
    templateUrl: './columns.component.html',
    styleUrls: ['./columns.component.css']
})
export class TestColumnsComponent implements OnInit {

    constructor() { }

    columns: Columns

    ngOnInit() {
        this.columns = {
            name: "Columns",
            values: [
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
        this.columns = {
            name: "Columns2",
            values: [
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
