import { Component, ElementRef } from '@angular/core'
import { ConnectionService } from './services/connection.service'
import { CommanderEvent } from './model/model'
import { ThemesService } from './services/themes.service'

@Component({
    selector: 'app-root',
    host: {
		"[class.blue-theme]": "themes.theme == 'blue'",
        "[class.light-blue-theme]": "themes.theme == 'lightblue'",
        "[class.dark-theme]": "themes.theme == 'dark'",
        "[class.ubuntu-theme]": "themes.theme == 'ubuntu'"
	},
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(public themes: ThemesService, private appElement: ElementRef, private connection: ConnectionService) { 
        this.connection.commanderEvents.subscribe(evt => {
            const commanderEvent: CommanderEvent = JSON.parse(evt)
            if (commanderEvent.theme) {
                themes.theme = commanderEvent.theme
                const bodyStyles = window.getComputedStyle(appElement.nativeElement)
                themes.itemHeight = <any>bodyStyles.getPropertyValue('--itemHeight')
                themes.testItemHeight = <any>bodyStyles.getPropertyValue('--testItemHeight')
                themes.columnHeight = <any>bodyStyles.getPropertyValue('--itemColumnHeight')
            }
        })  
    }
}
