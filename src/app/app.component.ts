import { Component, HostListener } from '@angular/core'
import { ConnectionService } from './services/connection.service'
import { remote } from 'electron';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private connection: ConnectionService) { }
    
    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event) {
        event.returnValue = true
        this.connection.post("close")        
        .then(() => remote.getCurrentWindow().destroy())
    }
}
