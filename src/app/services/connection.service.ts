import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    constructor() { }

    addEventListener(event: string) {
        this.source.addEventListener(event, evt => console.log("onEreignis", evt.data))
    }

    post(method: string) {
        return new Promise((res, rej) => {
            const request = new XMLHttpRequest()
            const encodedPath = encodeURI(method)
            request.open('POST', `${this.baseUrl}/${encodedPath}`, true)
            request.onload = e => res()
            request.send()
        })
    }

    source = new EventSource("events")
    private baseUrl = "http://localhost:20000"
}

