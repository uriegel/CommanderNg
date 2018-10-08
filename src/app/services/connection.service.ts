import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { Item } from '../model/model'

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    get commanderEvents(): Observable<string>  {
        return this.commanderSubject
    }
    get leftViewEvents(): Observable<Item[]>  {
        return this.leftViewSubject
    }
    get rightViewEvents(): Observable<Item[]>  {
        return this.rightViewSubject
    }

    constructor() {
        this.source.addEventListener("commander", (evt: MessageEvent) => this.commanderSubject.next(evt.data as string))
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
    private commanderSubject = new Subject<string>()
    private leftViewSubject = new Subject<Item[]>()
    private rightViewSubject = new Subject<Item[]>()
}

