import { ItemProcessor } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"

export class DrivesProcessor extends ItemProcessor {
    get columns() {
        return {
            name: "drives",
            columns: [
                { name: "Name", isSortable: true },
                { name: "Bezeichnung", isSortable: true },
                { name: "Größe", isSortable: true }
            ]            
        }
    }

    get(_: string): Observable<IItem[]> { return from(new Promise(
        (res, rej) => this.addon.getDrives((err, result) => res(result)))) }
}