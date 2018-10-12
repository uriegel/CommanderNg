import { Component } from '@angular/core'
import { ConnectionService } from './services/connection.service';
import { ThemesService } from './services/themes.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private connection: ConnectionService, themes: ThemesService) { 
        themes.setTheme("dark")
    }
}
