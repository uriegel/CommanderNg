import { Component, ElementRef } from '@angular/core'
import { ConnectionService } from './services/connection.service'
import { CommanderEvent } from './model/model'

@Component({
    selector: 'app-root',
    host: {
		"[class.blue-theme]": "theme == 'blue'",
        "[class.light-blue-theme]": "theme == 'lightblue'",
        "[class.dark-theme]": "theme == 'dark'",
        "[class.ubuntu-theme]": "theme == 'ubuntu'"
	},
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public theme: string;

    constructor(private elRef: ElementRef, private connection: ConnectionService) { 
        this.connection.commanderEvents.subscribe(evt => {
            const commanderEvent: CommanderEvent = JSON.parse(evt)
            if (commanderEvent.theme)
                this.theme = commanderEvent.theme
            setTimeout(() => {
                const bodyStyles = window.getComputedStyle(elRef.nativeElement)
                var fooBar = bodyStyles.getPropertyValue('--itemHeight')
                console.log("--itemHeight", fooBar)
            })
        })  
    }
}
