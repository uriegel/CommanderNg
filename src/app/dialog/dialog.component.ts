import { Component, OnInit, Input } from '@angular/core'
import { trigger, transition, style, animate, state } from '../../../node_modules/@angular/animations';

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

    @Input()
    isShowing = false
    
    constructor() { }

    ngOnInit() { }
}
