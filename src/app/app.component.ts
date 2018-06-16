import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() { 
    const Path = (<any>window).require('path')
    const text = Path.join("c:\\windows", "affe.txt")
    this.title = text
}
title: string = "nein"
}
