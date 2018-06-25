import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { CommanderViewComponent as Commander } from '../../commander-view/commander-view.component'

@Component({
    selector: 'app-test-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {
    
    @ViewChild(Commander) private commander: Commander

    ngAfterViewInit() { this.commander.focus() }
}
