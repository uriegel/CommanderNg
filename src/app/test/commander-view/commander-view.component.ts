import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { CommanderViewComponent as Commander } from '../../commander-view/commander-view.component'
import { ConnectionService } from 'src/app/services/connection.service'

@Component({
    selector: 'test-commander-view',
    template: '<app-commander-view [id]=0 [viewEvents]="connection.leftViewEvents|async"></app-commander-view>',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {
    
    @ViewChild(Commander) private commander: Commander

    ngAfterViewInit() { this.commander.focus() }

    constructor(private connection: ConnectionService) {}
}
