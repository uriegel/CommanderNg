import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Item } from '../model/model'

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    leftViewEvents = new Subject<Item[]>()
    rightViewEvents = new Subject<Item[]>()

    constructor() { 
        this.source.addEventListener("leftView", (evt: MessageEvent) => console.log("onEreignis", evt.data))
        this.source.addEventListener("rightView", (evt: MessageEvent) => console.log("onEreignis", evt.data))
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

    private source = new EventSource("events")
    private baseUrl = "http://localhost:20000"
}

