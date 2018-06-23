import { Injectable } from '@angular/core'
import { ItemProcessor, ProcessorType } from './item-processor'
import { DrivesProcessor } from './drives-processor';

@Injectable({
    providedIn: 'root'
})
export class ItemProcesserFactoryService {

    constructor() { }

    get(itemProcessor: ItemProcessor, path: string) {
        if (path == "drives") {
            if (itemProcessor && itemProcessor.type == ProcessorType.root)
                return null
            else
                return new DrivesProcessor()
        }   
    }
}
