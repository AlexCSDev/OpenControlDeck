import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DashboardEditDialogData {
  name: string
}

@Component({
  selector: 'app-edit-dashboard-controller',
  templateUrl: './edit-dashboard-controller.component.html',
  styleUrls: ['./edit-dashboard-controller.component.scss']
})
export class EditDashboardControllerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditDashboardControllerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DashboardEditDialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
