import { IColumns } from "../columns/columns.component";
import { Observable } from "rxjs";

export enum ProcessorType {
    root
}

export abstract class ItemProcessor  {
    type: ProcessorType

    abstract get columns(): IColumns

    //abstract get get(): Observable<>
}
