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

    private async onOkCancel() { 
        this.dialog.buttons = Buttons.OkCancel
        this.dialog.text = "Das ist der OK-Cancel-Dialog"
        const result = await this.dialog.show()
        console.log(result)
    }

    private async onYesNoCancel() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Das ist der JaNeinCancel-Dialog"
        const result = await this.dialog.show()
        console.log(result)
    }
    
    private async onInputYesNoCancel() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Das ist der Input-JaNeinCancel-Dialog"
        this.dialog.withInput = true
        const result = await this.dialog.show()
        console.log(result)
    }

    private async onlongText() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Mitte des Jahres 1992 lernte Nas MC Serch von 3rd Bass kennen, der sein Manager wurde und ihm noch im selben Jahr einen Plattendeal bei Columbia Records verschaffen konnte. Nas machte sein Solodebüt mit der Single Halftime zum Soundtrack des Films Zebrahead."
        this.dialog.withInput = true
        const result = await this.dialog.show()
        console.log(result)
    }
}
