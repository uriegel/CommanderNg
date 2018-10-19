import { Component, OnInit, ViewChild } from '@angular/core'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Response, CommanderView } from 'src/app/model/model';
import { ConnectionService } from 'src/app/services/connection.service';
import { Observable, from } from 'rxjs';

@Component({
    selector: 'app-test-columns',
    templateUrl: './columns.component.html',
    styleUrls: ['./columns.component.css']
})
export class TestColumnsComponent implements OnInit {

    constructor(private connection: ConnectionService) {
        this.columns = from(this.connection.get(CommanderView.Left))
    }

    columns: Observable<Response>

    ngOnInit() { }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    onChange(path: string) {
        this.columns = from(this.connection.get(CommanderView.Left, path))
    }
}
