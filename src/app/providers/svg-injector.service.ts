import { Injectable, Renderer2 } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class SvgInjectorService {

    constructor() { }

    getIcon(url: string) {
        var request = new XMLHttpRequest()
        request.open('GET', url, false)
        request.send()
        if (request.status == 200)
            return request.responseXML
        else
            return null
    }

    replace(renderer: Renderer2, svgImg: HTMLImageElement, svgFactory: Document) {
        const svg = svgFactory.cloneNode(true)
        const newSvg = svg.childNodes[1] as HTMLElement
        const classes = Array.from(svgImg.classList)
        classes.forEach(n => renderer.addClass(newSvg, n))
        if (svgImg.parentElement) {
            renderer.insertBefore(svgImg.parentElement, newSvg, svgImg)
            renderer.removeChild(svgImg.parentElement, svgImg)
//            svgImg.parentElement.replaceChild(newSvg, svgImg)
        }
    }

    injectSvgs(renderer: Renderer2) {
        const nodelist = document.querySelectorAll('img.svg')
        const svgs = Array.from(nodelist) as HTMLImageElement[]

        async function request(url: string)  {
            return new Promise<Document>(function (resolve, reject) {
                var request = new XMLHttpRequest()
                request.onload = function (data) {
                    if (request.status == 200)
                        resolve(request.responseXML!)
                    else
                        reject()
                };
                request.open('GET', url)
                request.send()
            })
        }

        svgs.forEach(async svgImg => {
            const svg = await request(svgImg.src)
            const newSvg = svg.childNodes[1] as HTMLElement
            // if (svgImg.id)
            //     newSvg.id = svgImg.id
            const classes = Array.from(svgImg.classList)
            classes.forEach(n => renderer.addClass(newSvg, n))
            if (svgImg.parentElement)
                svgImg.parentElement.replaceChild(newSvg, svgImg)
        })
    }    
}


