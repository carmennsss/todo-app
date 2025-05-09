import { Component, inject, Input, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'sidebar-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  standalone: true,
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly title = model(this.data.title);

  inputValue: string = this.data?.title ?? '';

  constructor() {}

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Closes the dialog.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
