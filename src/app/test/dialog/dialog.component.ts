import { Component, OnInit, ViewChild } from '@angular/core'
import { DialogComponent as Dialog } from '../../dialog/dialog.component'
import { Buttons } from '../../enums/buttons.enum';

@Component({
    selector: 'test-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    @ViewChild(Dialog) dialog: Dialog

    ngOnInit() { }

    private onOk() { 
        this.dialog.buttons = Buttons.Ok
        this.dialog.text = "Das ist der OK-Dialog"
        this.dialog.show()
    }

    private onOkCancel() { 
        this.dialog.buttons = Buttons.OkCancel
        this.dialog.text = "Das ist der OK-Cancel-Dialog"
        this.dialog.show()
    }

    private onYesNoCancel() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Das ist der JaNeinCancel-Dialog"
        this.dialog.show()
    }
}
