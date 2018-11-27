import { Component, OnInit, ViewChild } from '@angular/core'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Response } from 'src/app/model/model';
import { ConnectionService } from 'src/app/services/connection.service';
import { Observable, from } from 'rxjs';

@Component({
    selector: 'app-test-columns',
    templateUrl: './columns.component.html',
    styleUrls: ['./columns.component.css']
})
export class TestColumnsComponent implements OnInit {

    constructor(private connection: ConnectionService) {
        this.response = from(this.connection.get("root", true))
    }

    response: Observable<Response>

    ngOnInit() { }

    onColumnsChanged(name: string) {
        console.log("New Columns", name)
        this.columns = name
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    onChange(path: string) {
        this.response = from(this.connection.get(path, path == "root" ? this.columns != "root" : this.columns == "root"))
    }

    private columns = ""
}
