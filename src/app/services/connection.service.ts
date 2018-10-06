import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    constructor() { }

    syncPost(method: string) {
        const request = new XMLHttpRequest()
        const encodedPath = encodeURI(method)
        request.open('GET', `${this.baseUrl}/${method}`, false)
        request.send()
    }

    private baseUrl = "http://localhost:20000"
}
