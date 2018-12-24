import { Component, ElementRef, NgZone } from '@angular/core'
import { ThemesService } from './services/themes.service';

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
    constructor(private zone: NgZone, private themes: ThemesService, private appElement: ElementRef) { 
        app = this
    }

    setTheme(theme: string) {
        this.zone.run(() => {
            console.log("Theme changed", theme)
            this.themes.theme = theme
            setTimeout(() => {
                const bodyStyles = window.getComputedStyle(this.appElement.nativeElement)
                this.themes.itemHeight = <any>bodyStyles.getPropertyValue('--itemHeight')
                this.themes.testItemHeight = <any>bodyStyles.getPropertyValue('--testItemHeight')
                this.themes.columnHeight = <any>bodyStyles.getPropertyValue('--itemColumnHeight')
            })        
        })
    }
}

declare var app: AppComponent
