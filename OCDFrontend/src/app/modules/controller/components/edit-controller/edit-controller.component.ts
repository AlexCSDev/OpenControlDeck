import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridsterItem } from 'angular-gridster2';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Command } from '../../interfaces/controllerInterfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ItemEditDialogData {
  isEditing: boolean;
  item: GridsterItem;
}

@Component({
  selector: 'app-edit-controller',
  templateUrl: './edit-controller.component.html',
  styleUrls: ['./edit-controller.component.scss']
})
export class EditControllerComponent implements OnInit {
  commandsList: Array<Command>;
  baseCommands: Array<Command>;

  constructor(public dialogRef: MatDialogRef<EditControllerComponent>, @Inject(MAT_DIALOG_DATA) public data: ItemEditDialogData, 
              private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private _snackBar: MatSnackBar) { 
                this.commandsList = [];
                this.baseCommands = [];
                let httpGetCommand:Command = {name:'Http Get', commandName: 'httpget', helpText: 'Call specified url via http using GET method.'};
                this.baseCommands.push(httpGetCommand);

                let goToCommand:Command = {name: 'Go to dashboard', commandName: 'goto', helpText: 'Open specified dashboard.'};
                this.baseCommands.push(goToCommand);
              }

  ngOnInit() {
    this.http.get<Array<Command>>(this.baseUrl + 'commands').subscribe(result => {
      this.commandsList = [];
      this.commandsList = this.commandsList.concat(this.baseCommands);
      this.commandsList = this.commandsList.concat(result);
    }, error => this.onError(error));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onError(error: HttpErrorResponse) {
    console.error(error);
    let msg = error.message;
    if(typeof(error.error) == "string") {
      msg = error.error
    }
    this._snackBar.open("Error occured: "+msg, "Close", {
      panelClass: ['snackbarError']
    });
  }

}
