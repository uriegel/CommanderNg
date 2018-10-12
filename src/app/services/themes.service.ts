import { Injectable } from '@angular/core'

function removeThemes() {
    let styleSheet = document.getElementById("dark")
    if (styleSheet)
        styleSheet.remove()
    styleSheet = document.getElementById("blue")
    if (styleSheet)
        styleSheet.remove()
    styleSheet = document.getElementById("lightblue")
    if (styleSheet)
        styleSheet.remove()     
    styleSheet = document.getElementById("ubuntu")
        if (styleSheet)
            styleSheet.remove()    
}

@Injectable({
    providedIn: 'root'
})
export class ThemesService {

    constructor() { }

    setTheme(theme: string) {
        removeThemes()
        const head = document.getElementsByTagName('head')[0]
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.id = 'theme'
        link.type = 'text/css'
        link.href = `assets/themes/${theme}.css`
        link.media = 'all'
        head.appendChild(link)    
    } 
}
