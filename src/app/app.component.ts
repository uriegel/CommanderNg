import { Component, ElementRef } from '@angular/core'

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
    constructor(private appElement: ElementRef) { 
        // electron.themeChanged.subscribe(theme => {
        //     console.log("Theme changed", theme)
        //     themes.theme = theme
        //     setTimeout(() => {
        //         const bodyStyles = window.getComputedStyle(appElement.nativeElement)
        //         themes.itemHeight = <any>bodyStyles.getPropertyValue('--itemHeight')
        //         themes.testItemHeight = <any>bodyStyles.getPropertyValue('--testItemHeight')
        //         themes.columnHeight = <any>bodyStyles.getPropertyValue('--itemColumnHeight')
        //     })
        // })
    }
}
