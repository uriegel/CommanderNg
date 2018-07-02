import { Observable, from, fromEvent, ReplaySubject, zip, pipe } from "rxjs"
import { map, withLatestFrom, filter } from "rxjs/operators"
import { IItem, TableViewComponent } from "./table-view/table-view.component"

export class Restricter {
    constructor(private tableView: TableViewComponent) {
        let restrictedString = ""
        const input = fromEvent(tableView.table.nativeElement, "keydown") as Observable<KeyboardEvent>
        const inputChars = input.pipe(filter(n => n.key.length > 0 && n.key.length < 2))
        const items = new ReplaySubject<IItem[]>(1)
        inputChars.subscribe(n => {
            (this.tableView.items as Observable<IItem[]>).subscribe(n => items.next(n))
            console.log("Daun", n)}
        )
        inputChars.subscribe(n => console.log("Kärr", n.key))

        const restictedValue = zip(inputChars, items, (char, itemArray) => {
            return {
                char: char.key,
                items: itemArray.filter(n => n.name.toLowerCase().startsWith(restrictedString + char.key))
            }
        })
        restictedValue.subscribe(n => {
            if (n.items.length > 0) {
                restrictedString += n.char
                console.log("restrictedString", restrictedString)
            }
            console.log("RestrictedValue", n)}
        )

        const backSpaces = input.pipe(filter(n => n.which == 8))
        const backItems = new ReplaySubject<IItem[]>(1)
        const back = zip(backSpaces, backItems, (char, itemArray) => {
            restrictedString = restrictedString.substr(0, restrictedString.length - 1)
            return {
                items: itemArray.filter(n => n.name.toLowerCase().startsWith(restrictedString))
            }
        })
        back.subscribe(n => {
            if (n.items.length > 0) {
                console.log("restrictedString", restrictedString)
            }
            console.log("RestrictedValue", n)}
        )
        backSpaces.subscribe(n => {
            (this.tableView.items as Observable<IItem[]>).subscribe(n => backItems.next(n))
            console.log("Back", n)}
        )

        items.subscribe(n => console.log("input gekommen", n))
    }

    onKeyPress(n: Number) {
    }

    restrict(restrictString: string) {
        return null
    }
}