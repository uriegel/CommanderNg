import { Component, OnInit, ViewChild } from '@angular/core'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Columns, CommanderView } from 'src/app/model/model';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
    selector: 'app-test-columns',
    templateUrl: './columns.component.html',
    styleUrls: ['./columns.component.css']
})
export class TestColumnsComponent implements OnInit {

    constructor(private connection: ConnectionService) { }

    columns: Columns

    async ngOnInit() {

        const response = await this.connection.get(CommanderView.Left)
        if (response.columns) 
            this.columns = response.columns
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    async onFiles() {
        const response = await this.connection.get(CommanderView.Left, "c:\\windows\\system32")
        if (response.columns) 
            this.columns = response.columns
    }

    async onDrives() {
        const response = await this.connection.get(CommanderView.Left, "drives")
        if (response.columns) 
            this.columns = response.columns
    }
}
