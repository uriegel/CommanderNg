import { Injectable, NgZone, ElementRef } from '@angular/core'
import { ThemesService } from './themes.service';
import { Subject, Observable } from 'rxjs';
const { ipcRenderer } = (<any>window).require('electron')

@Injectable({
    providedIn: 'root'
})
export class ElectronService {

    readonly themeChanged: Observable<string> = new Subject<string>()

    constructor(private themes: ThemesService, private zone: NgZone) {
        ipcRenderer.on("setTheme", (_: any, theme: string) => {
            this.zone.run(() => {
                (this.themeChanged as Subject<string>).next(theme)
            })
        })
    }   
}
