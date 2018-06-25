import { Injectable } from '@angular/core'
import { ItemProcessor, ProcessorType } from './item-processor'
import { DrivesProcessor } from './drives-processor'
import { FileProcessor } from './file-processor'
import { CommanderViewComponent } from '../commander-view/commander-view.component'

@Injectable({
    providedIn: 'root'
})
export class ItemProcesserFactoryService {

    constructor() { }

    get(itemProcessor: ItemProcessor, commanderView: CommanderViewComponent, path: string) {
        if (path == "drives") {
            if (itemProcessor && itemProcessor.type == ProcessorType.root)
                return null
            else
                return new DrivesProcessor(commanderView)
        }   
        else {
            if (itemProcessor && itemProcessor.type == ProcessorType.file)
                return null
            else
                return new FileProcessor(commanderView)
        }
    }
}
