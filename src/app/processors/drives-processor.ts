import { ItemProcessor, ProcessorType } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { DriveInfo } from "../addon";

export class DrivesProcessor extends ItemProcessor {

    type: ProcessorType = ProcessorType.root

    get columns() {
        return {
            name: "drives",
            columns: [
                { name: "Name" },
                { name: "Bezeichnung" },
                { name: "Größe" }
            ]            
        }
    }

    get(_: string, recentPath?: string): Observable<IItem[]> { return from(new Promise(
        (res, rej) => this.addon.getDrives(
            (err, result) => {
                let currentItem: IItem = null
                if (recentPath) 
                    currentItem = result.find(n => n.name.startsWith(recentPath))
                if (!currentItem)
                    currentItem = result[0]
                if (currentItem)
                    currentItem.isCurrent = true
                res(result)
            }
        ))) 
    }

    process(item: IItem) {
        const driveItem = item as DriveInfo
        if (driveItem.type == 2) 
            this.commanderView.path = driveItem.name
    } 

    createFolder(path: string) {
        return from(new Promise((res, rej) => 
            rej("Du kannst hier keinen Ordner anlegen!")
        ))
    }
}