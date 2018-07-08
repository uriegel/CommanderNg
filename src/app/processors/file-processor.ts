import { ItemProcessor, ProcessorType } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { FileItem } from "../addon"
import { NgZone } from "@angular/core"
import { CommanderViewComponent } from "../commander-view/commander-view.component"
import { FileExtensionPipe } from "../pipes/file-extension.pipe"
import { SettingsService } from "../services/settings.service"

export class FileProcessor extends ItemProcessor {
    type: ProcessorType = ProcessorType.file
    
    constructor(commanderView: CommanderViewComponent, private zone: NgZone, protected settings: SettingsService) {
        super(commanderView, settings)
    }

    get columns() {
        return {
            name: "file",
            columns: [
                { name: "Name", isSortable: true },
                { name: "Erw.", isSortable: true },
                { name: "Datum", isSortable: true },
                { name: "Größe", isSortable: true },
                { name: "Version", isSortable: true }
            ]        
        }
    }

    canCreateFolder() {
        return true
    }

    get(path: string, recentPath?: string): Observable<IItem[]> { 
        this.requestId = ++FileProcessor.requestId
        return from(new Promise(
        (res, rej) => this.addon.readDirectory(path, 
            (err, result) => {
                const parentItem: FileItem[] = [ {
                    name: "..",
                    type: 3
                }]
                let currentItem: IItem = null
                if (!this.settings.showHidden)
                    result = result.filter(n => !n.isHidden)
                const dirs = result.filter(n => n.type == 1)
                if (recentPath) {
                    const index = recentPath.lastIndexOf('\\')
                    if (index != -1) {
                        const pathName = recentPath.substr(index + 1)
                        currentItem = dirs.find(n => n.name == pathName)
                    }
                }
                const files = result.filter(n => n.type == 0)
                const items = [...parentItem, ...dirs, ...files]
                if (!currentItem)
                    currentItem = items[0]
                if (currentItem)
                    currentItem.isCurrent = true
                res(items)

                const versionFiles = files.filter(n => n.name.toLowerCase().endsWith(".dll") || n.name.toLowerCase().endsWith(".exe"))
                const imgFiles = files.filter(n => n.name.toLowerCase().endsWith(".jpg"))
                let id = this.requestId
                let inBackground = async () => {
                    for (let i = 0; i < versionFiles.length; i++) {
                        if (id < this.requestId)
                            break
                        var version = await this.getFileVersion(`${path}\\${versionFiles[i].name}`)
                        if (version) 
                            this.zone.run(() => versionFiles[i].version = version)
                    }
                    for (let i = 0; i < imgFiles.length; i++) {
                        if (id < this.requestId)
                            break
                        var exif = await this.getExifDate(`${path}\\${imgFiles[i].name}`)
                        if (exif) {
                            this.zone.run(() => {
                                imgFiles[i].time = exif
                                imgFiles[i].isExif = true
                            })
                        }
                    }
                }
                inBackground()
            })
        ))
    }

    process(item: IItem) {
        const fileItem = item as FileItem
        switch (fileItem.type) {
            case 1:
                this.commanderView.path = `${this.commanderView.path}\\${fileItem.name}`
                break;
            case 3:
                const parent = this.getParent()
                this.commanderView.path = parent
                break;
        }
    } 

    close() {
        this.requestId = ++FileProcessor.requestId
    }

    sort(items: FileItem[], columnIndex: number, isAscending: boolean): IItem[] { 
        const dirs = items.filter(n => n.type == 1 || n.type == 3)
        let files = items.filter(n => n.type == 0)
        let predicate: (a: FileItem, b: FileItem)=>number
        switch (columnIndex) {
            case 0:
                predicate = (a, b) => a.name.localeCompare(b.name)
                break
            case 1:
                predicate = (a, b) => this.fileExtensionPipe.transform(a.name).localeCompare(this.fileExtensionPipe.transform(b.name))
                break
            case 2:
                predicate = (a, b) => a.time.getTime() - b.time.getTime()
                break
            case 3:
                predicate = (a, b) => a.size - b.size
                break
            case 4:
                predicate = (a, b) => this.compareVersion(a.version, b.version)
                break
        }
        files = files.sort((a, b) => this.sortItem(a, b, isAscending, predicate))
        
        return [...dirs, ...files]
    }

    private sortItem(a: FileItem, b: FileItem, isAscending: boolean, predicate: (a: FileItem, b: FileItem)=>number): number {
        const result = predicate(a, b)
        return isAscending ? result : -result
    }

    private getParent() {
        const index = this.commanderView.path.lastIndexOf("\\")
        if (index != -1) 
            return this.commanderView.path.substr(0, index)
        else
            return "drives"
    }

    private async getFileVersion(path: string) {
        return new Promise<string>((res, rej) => {
            this.addon.getFileVersion(path, (err, result) => res(result))
        })
    }

    private async getExifDate(path: string) {
        return new Promise<Date>((res, rej) => {
            this.addon.getExifDate(path, (err, result) => res(result))
        })
    }

    private compareVersion(versionLeft?: string, versionRight?: string): number {
        if (!versionLeft)
            return -1
        else if (!versionRight)
            return 1
        else {
            var leftParts = <number[]><any>versionLeft.split('.')
            var rightParts = <number[]><any>versionRight.split('.')
            if (leftParts[0] != rightParts[0])
                return <number>leftParts[0] - rightParts[0]
            else if (leftParts[1] != rightParts[1])
                return leftParts[1] - rightParts[1]
            else if (leftParts[2] != rightParts[2])
                return leftParts[2] - rightParts[2]
            else if (leftParts[3] != rightParts[3])
                return leftParts[3] - rightParts[3]
            else return 0
        }
    }

    fileExtensionPipe = new FileExtensionPipe()
    requestId = 0
    static requestId = 0
}