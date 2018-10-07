import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    constructor() { }

    post(method: string) {
        return new Promise((res, rej) => {
            const request = new XMLHttpRequest()
            const encodedPath = encodeURI(method)
            request.open('GET', `${this.baseUrl}/${encodedPath}`, true)
            request.onload = e => res()
            request.send()
        })
    }

    private baseUrl = "http://localhost:20000"
}
