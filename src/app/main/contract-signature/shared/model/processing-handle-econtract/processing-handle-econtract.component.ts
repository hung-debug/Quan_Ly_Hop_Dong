import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-processing-handle-econtract',
  templateUrl: './processing-handle-econtract.component.html',
  styleUrls: ['./processing-handle-econtract.component.scss']
})
export class ProcessingHandleEcontractComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      contract_related: any;
      content: any},
    public router: Router,
    public dialog: MatDialog,
    // public name: LoginComponent
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
