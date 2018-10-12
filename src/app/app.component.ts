import { Component } from '@angular/core'
import { ConnectionService } from './services/connection.service'
import { ThemesService } from './services/themes.service'
import { CommanderEvent } from './model/model'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private connection: ConnectionService, themes: ThemesService) { 
        themes.setTheme("dark")
        this.connection.commanderEvents.subscribe(evt => {
            const commanderEvent: CommanderEvent = JSON.parse(evt)
            if (commanderEvent.theme)
                themes.setTheme(commanderEvent.theme)
        })  
    }
}
