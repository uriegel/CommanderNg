import { Component, AfterViewInit, ViewChild, Input } from '@angular/core'
import { CommanderViewComponent as Commander } from '../../commander-view/commander-view.component'
import { ConnectionService } from 'src/app/services/connection.service'
import { CommanderEvent } from 'src/app/model/model';
import { ElectronService } from 'src/app/services/electron.service'
// TODO: From c: per .. to root: Columns not switched, but on Input changed
@Component({
    selector: 'test-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {
    
    @ViewChild(Commander) private commander: Commander

    ngAfterViewInit() { this.commander.focus() }

    constructor(public electron: ElectronService,
        public connection: ConnectionService) {}
}
