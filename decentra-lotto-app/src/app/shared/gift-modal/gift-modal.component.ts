import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Web3 from 'web3';

function validateAddress(c: FormControl) {
  const forbidden = Web3.utils.isAddress(c.value);
  return forbidden == false ? {forbiddenName: {value: c.value}} : null;
}

@Component({
  selector: 'app-gift-modal',
  templateUrl: './gift-modal.component.html',
  styleUrls: ['./gift-modal.component.css']
})
export class GiftModalComponent {
  address = new FormControl('', [Validators.required, validateAddress]);

  // receive data from parent using 'MAT_DIALOG_DATA'
  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<GiftModalComponent>) { }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: false });
  }

  confirm() {
    if (this.address.valid){
      // closing itself and sending data to parent component
      this.dialogRef.close({ data: this.address.value });
    }else{
      this.dialogRef.close({ data: false });
    }
  }
}
