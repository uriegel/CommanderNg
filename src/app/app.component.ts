import { Component, HostListener } from '@angular/core'
import { ConnectionService } from './services/connection.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private connection: ConnectionService) { }
    
    @HostListener('window:unload', ['$event'])
    onUnload(event) {
        this.connection.syncPost("close", )
    }
}
