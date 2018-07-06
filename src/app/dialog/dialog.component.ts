import { Component, OnInit, Input } from '@angular/core'
import { trigger, transition, style, animate } from '../../../node_modules/@angular/animations';

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
                animate(500, style({
                    opacity: 1
                })) // the new state of the transition(after transiton it removes)
            ]),
            transition('* => void', [
                animate(500, style({
                    opacity: 0
                })) // the new state of the transition(after transiton it removes)
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
