import { Observable, from } from "rxjs"
import { IItem } from "./table-view/table-view.component"
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";

export class Restricter {
    static check(fileStartChar: string) {
        return fileStartChar.match(Restricter.startChars)
    }

    constructor(items: Observable<IItem[]>) {
        const subscription = items.subscribe(value => {
            this.items = value
            subscription.unsubscribe()
        })
    }

    restrict(restrictString: string) {
        const restrictItems = this.items.filter(n => n.name.toLowerCase().startsWith(restrictString))
        return restrictItems ? from(new Promise<IItem[]>(res => res(restrictItems))) : null
    }

    private static startChars = /^[A-Za-z0-9_äÄöÖüÜß]/
    private items: IItem[] 
}