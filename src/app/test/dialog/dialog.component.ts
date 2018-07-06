import { Component, OnInit, ViewChild } from '@angular/core'
import { DialogComponent as Dialog } from '../../dialog/dialog.component'

@Component({
    selector: 'test-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    @ViewChild(Dialog) dialog: Dialog

    ngOnInit() { }

    private onOk() { 
        this.dialog.text = "Das ist der OK-Dialog"
        this.dialog.show()
    }
}
