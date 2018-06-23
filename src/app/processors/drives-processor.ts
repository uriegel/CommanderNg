import { ItemProcessor } from "./item-processor"

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
}