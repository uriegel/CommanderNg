import { Injectable } from '@angular/core'
import { Subject, Observable, BehaviorSubject } from 'rxjs'
import { Item, Response, Get, CommanderView } from '../model/model'

function formatParams(params) {
    return "?" + Object
        .keys(params)
        .map(key => key+"="+encodeURIComponent(params[key]))
        .join("&")
}

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
        this.source.addEventListener("commander", (evt: MessageEvent) => {
            console.log("Commander event", evt)
            this.commanderSubject.next(evt.data as string)
        })
        
        this.source.addEventListener("leftView", (evt: MessageEvent) => this.leftViewSubject.next(evt.data))
        this.source.addEventListener("rightView", (evt: MessageEvent) => this.rightViewSubject.next(evt.data))
    }

    get(commanderView: CommanderView, path?: string) {
        const get: Get = path ? {
            path: path,
            commanderView: commanderView
        } : { commanderView: commanderView }
        return this.post<Response>("get", formatParams(get))
    }

    private post<T>(method: string, param = "") {
        return new Promise<T>((res, rej) => {
            const request = new XMLHttpRequest()
            request.open('POST', `${this.baseUrl}/request/${method}${param}`, true)
            request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
            request.onload = evt => {
                var result = <T>JSON.parse(request.responseText)
                res(result)
            }
            request.send()
        })
    }

    private source = new EventSource("events")
    private baseUrl = "http://localhost:20000"
    private commanderSubject = new Subject<string>()
    private leftViewSubject = new BehaviorSubject<Item[]>(null)
    private rightViewSubject = new BehaviorSubject<Item[]>(null)
}

