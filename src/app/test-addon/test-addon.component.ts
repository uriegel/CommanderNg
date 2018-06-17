import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-test-addon',
    templateUrl: './test-addon.component.html',
    styleUrls: ['./test-addon.component.css']
})
export class TestAddonComponent implements OnInit {

    constructor() { }

    directText = ""
    laterText = ""
    eventText = "später"
        
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

    ngOnInit() {
        setInterval(() => {
            this.eventText = `${(new Date())}`
            console.log(this.eventText)
        }, 2000)
    }
}
