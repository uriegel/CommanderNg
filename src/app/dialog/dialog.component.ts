import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { trigger, transition, style, animate, state } from '../../../node_modules/@angular/animations'
import { Buttons } from '../enums/buttons.enum'
import { DialogResult } from '../enums/dialog-result.enum'

// TODO: select all (fileOnly) behavior
// TODO: default button

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
                animate("1s ease-out", style({
                    opacity: 1
                })) // the new state of the transition(after transiton it removes)
            ]),
            transition('* => void', [
                animate("300ms ease-in", style({
                    opacity: 0
                })) // the new state of the transition(after transiton it removes)
            ])
        ]),
        trigger('flyInOut', [
            state('in', style({
                opacity: 1,
                transform: 'translateX(0)'}
            )),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-50%)'
                }),
                animate("200ms ease-out"),
            ]),
            transition('* => void', [
                animate("200ms ease-in" , style({
                    opacity: 0,
                    transform: 'translateX(50%)'
                }, ))
            ])
        ])            
    ]        
})
export class DialogComponent implements OnInit {

    @ViewChild("ok") ok: ElementRef
    @ViewChild("no") no: ElementRef
    @ViewChild("input") input: ElementRef
    text = ""
    buttons = Buttons.Ok
    withInput = false
    noHasFocus = false

    constructor() { }

    ngOnInit() { }

    show() { 
        return new Promise<DialogResult>((res, rej) => {
            this.isShowing = true 
            setTimeout(() => 
                this.withInput 
                ? this.input.nativeElement.focus() 
                : this.noHasFocus 
                    ? this.no.nativeElement.focus()
                    : this.ok.nativeElement.focus(),
                0)
            this.dialogFinisher = res
        })
    }

    private onFocusIn(evt: Event) {
        if (!(evt.target as HTMLElement).closest(".dialogContainer"))
            this.ok.nativeElement.focus()
    }

    private onKeyDown(evt: KeyboardEvent) {
        if (evt.which == 27) // Esc
            this.close(DialogResult.Cancelled)
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

    private okClick() { this.close(DialogResult.Ok) }

    private cancelClick() { this.close(DialogResult.Cancelled) }

    private noClick() { this.close(DialogResult.No) }

    private close(result: DialogResult) {
        this.withInput = false
        this.isShowing = false 
        this.dialogFinisher(result)
    }

    private dialogFinisher: (res: DialogResult) => void
    private isShowing = false
}
