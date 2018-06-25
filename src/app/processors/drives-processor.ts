import { ItemProcessor } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { DriveInfo } from "../addon";

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

    process(item: IItem) {
        const driveItem = item as DriveInfo
        if (driveItem.type == 2) 
            this.commanderView.path = driveItem.name
    } 
}