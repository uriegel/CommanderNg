import { Component, OnInit } from '@angular/core'

interface Addon {
    getTest(input: string): string
    getTestAsync(input: string, callback: (error: any, result: string) => void): void
    createDirectory(input: string, callback: (error: any, result: number) => void): void
}

enum Service {
    All,
    CTI,
    ContactCenter
}

enum ApiLevel {
    ExclusiveSoapAccess,
    WebServerExtension,
    Version2016,
    Version2017
}

@Component({
    selector: 'app-test-addon',
    templateUrl: './test-addon.component.html',
    styleUrls: ['./test-addon.component.css']
})
export class TestAddonComponent implements OnInit {

    constructor() { }

    directText = ""
    laterText = ""
    intervalText = "später"
    eventText = ""
    httpText = ""
    addonText = "leer"
    addonAsyncText = "leer"
        
    ngOnInit() {
        setInterval(() => {
            this.intervalText = `${(new Date())}`
            console.log(this.intervalText)
        }, 2000)
    }

    onDirect() {
        this.directText = `${(new Date())}`
        console.log(this.directText)
    }

    onLater() {
        setTimeout(() => {
            this.laterText = `${(new Date())}`
            console.log(this.laterText)
        }, 2000)
    }

    onAddon() {
        const addon: Addon = (<any>window).require('addon')
        this.addonText = addon.getTest("Das erste Mal")

    }

    onCreateDirectoryAsync() {
        const addon: Addon = (<any>window).require('addon')
        addon.createDirectory("C:\\Users\\urieg\\Desktop\\VomCommander", (_, res) => {
            console.log(res)
            this.addonAsyncText = `${res}`
        })
    }

    onCreateDirectoryInWindowsAsync() {
        const addon: Addon = (<any>window).require('addon')
        addon.createDirectory("C:\\Windows\\VomCommander", (_, res) => {
            console.log(res)
            this.addonAsyncText = `${res}`
        })
    }

    async onHttp() {
        const result = await this.loginForTimio("riegel", "caesar", Service.All, true, "", ApiLevel.Version2017)
        this.httpText = (<any>result).ServerVersion
        this.startHttpEventProcessing((<any>result).sessionId, () => this.eventText = `${(new Date())}`)
    }

    async loginForTimio(name: string, password: string, service: Service, force: boolean, sessionId: string, apiLevel: ApiLevel) {
        var param = {
            name: name,
            password: password,
            service: service,
            force: force,
            sessionId: sessionId,
            apiLevel: apiLevel
        };
        return await this.invokeAsync('LoginForTimio', param);
    }

    startHttpEventProcessing(sessionId, newEvent, callbackError?) {
        if (!sessionId)
            return;
        this.invoke('GetEvents', {
            SessionId: sessionId
        }, result => {
            newEvent(result);
            this.startHttpEventProcessing(sessionId, newEvent, callbackError);
        }, error => {
            if (error.status == 200 && error.returnValue.Code == 38)
            this.startHttpEventProcessing(sessionId, newEvent, callbackError);
            else if (callbackError)
                callbackError(error);
        });
    }

    private async invokeAsync(method, param) {
        return new Promise((resolve, reject) => {
            this.invoke(method, param, result => resolve(result), error => reject(error)
        )})
    }    
    private invoke(method: string, param: any, callbackResult: (param:any)=>void, callbackError: (param:any)=>void) {
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var result = JSON.parse(xmlhttp.responseText)
                    if (result.returnValue.Code != 0) {
                        result.status = 200
                        callbackError(result)
                        return
                    }
                    if (callbackResult)
                        callbackResult(result)
                }
                else if (callbackError) {
                    callbackError({
                        status: xmlhttp.status,
                        statusText: xmlhttp.statusText
                    })
                }
            }
        }
        xmlhttp.open('POST', "https://caesar2go.caseris.de" + "/proxy/" + method, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xmlhttp.send(JSON.stringify(param));        
    }
}
