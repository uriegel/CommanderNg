import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemesService {
    constructor() { }

    itemHeightChanged: Observable<boolean> = new Subject<boolean>();

    theme = ""

    get itemHeight() { return this._itemHeight }
    set itemHeight(value: number) { 
        this._itemHeight = value 
        setTimeout(() => (this.itemHeightChanged as Subject<boolean>).next(true))
        console.log("New itemHeight:", this.itemHeight)
    }
    _itemHeight = 0

    testItemHeight = 0
}
