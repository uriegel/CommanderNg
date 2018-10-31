import { Component, AfterViewInit, ViewChild, Input } from '@angular/core'
import { CommanderViewComponent as Commander } from '../../commander-view/commander-view.component'
import { ConnectionService } from 'src/app/services/connection.service'
import { CommanderEvent } from 'src/app/model/model';

@Component({
    selector: 'test-commander-view',
    template: '<app-commander-view [id]=0 [viewEvents]="connection.leftViewEvents|async"></app-commander-view>',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {
    
    @ViewChild(Commander) private commander: Commander

    ngAfterViewInit() { this.commander.focus() }

    @Input()
    set commanderEvents(data: string) {
        if (data) {
            const evt = JSON.parse(data) as CommanderEvent
            if (evt.showHidden) {
                console.log("ShowHidden", !!evt.showHidden.value)
            }
        }
    }    

    constructor(private connection: ConnectionService) {}
}
