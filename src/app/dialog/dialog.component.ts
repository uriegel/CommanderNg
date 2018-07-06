import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { trigger, transition, style, animate, state } from '../../../node_modules/@angular/animations'
import { Buttons } from '../enums/buttons.enum'
import { DialogResult } from '../enums/dialog-result.enum'

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition('void => *', [
                style({
                    opacity: 0
                }), //style only for transition transition (after transiton it removes)
                animate("600ms ease-out", style({
                    opacity: 1
                })) // the new state of the transition(after transiton it removes)
            ]),
            transition('* => void', [
                animate("600ms ease-in", style({
                    opacity: 0
                })) // the new state of the transition(after transiton it removes)
            ])
        ]),
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
                style({transform: 'translateX(-50%)'}),
                animate("300ms ease-out"),
            ]),
            transition('* => void', [
                animate("300ms ease-in" , style({
                    transform: 'translateX(50%)'
                }, ))
            ])
        ])            
    ]        
})
export class DialogComponent implements OnInit {

    @ViewChild("ok") ok: ElementRef
    text = ""
    buttons = Buttons.Ok

    constructor() { }

    ngOnInit() { }

    show() { 
        return new Promise<DialogResult>((res, rej) => {
            this.isShowing = true 
            setTimeout(() => this.ok.nativeElement.focus(), 0)
            this.dialogFinisher = res
        })
    }

    private onFocusIn(evt: Event) {
        if (!(evt.target as HTMLElement).closest(".dialogContainer"))
            this.ok.nativeElement.focus()
    }

    private onKeyDown(evt: KeyboardEvent) {
        if (evt.which == 27) {// Esc
            this.isShowing = false
            this.dialogFinisher(DialogResult.Cancelled)
        }
    }    

    private onKeyDownOk(evt: KeyboardEvent) {
        if (evt.which == 13 || evt.which == 32) // Return || space
            this.okClick()
    }

    private onKeyDownCancel(evt: KeyboardEvent) {
        if (evt.which == 13 || evt.which == 32) // Return || space
            this.cancelClick()
    }
    
    private onKeyDownNo(evt: KeyboardEvent) {
        if (evt.which == 13 || evt.which == 32) // Return || space
            this.noClick()
    }

    private okClick() { 
        this.isShowing = false 
        this.dialogFinisher(DialogResult.Ok)
    }

    private cancelClick() { 
        this.isShowing = false 
        this.dialogFinisher(DialogResult.Cancelled)
    }

    private noClick() { 
        this.isShowing = false 
        this.dialogFinisher(DialogResult.No)
    }

    private dialogFinisher: (res: DialogResult) => void
    private isShowing = false
}
