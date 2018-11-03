import { Component, AfterViewInit, ViewChild, Input } from '@angular/core'
import { CommanderViewComponent as Commander } from '../../commander-view/commander-view.component'
import { ConnectionService } from 'src/app/services/connection.service'
import { CommanderEvent } from 'src/app/model/model';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
    selector: 'test-commander-view',
    template: '<app-commander-view [id]="0" [viewEvents]="connection.leftViewEvents|async" [showHidden]="electron.showHiddenChanged | async"></app-commander-view>',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {
    
    @ViewChild(Commander) private commander: Commander

    ngAfterViewInit() { this.commander.focus() }

    constructor(public electron: ElectronService,
        public connection: ConnectionService) {}
}
