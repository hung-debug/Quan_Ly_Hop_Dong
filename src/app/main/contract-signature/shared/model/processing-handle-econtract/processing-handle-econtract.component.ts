import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-processing-handle-econtract',
  templateUrl: './processing-handle-econtract.component.html',
  styleUrls: ['./processing-handle-econtract.component.scss']
})
export class ProcessingHandleEcontractComponent implements OnInit {
  is_list_name: any = [];
  status: any = [
    {
      value: 0,
      name: 'Tạm dừng'
    },
    {
      value: 1,
      name: 'Hoạt động'
    }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      determine_contract: any,
      content: any},
    public router: Router,
    public dialog: MatDialog,
    // public name: LoginComponent
  ) {
  }

  ngOnInit(): void {
    this.data.determine_contract.forEach((item: any) => {
      item.recipients.forEach((element: any) => {
        let data = {
          name: element.name,
          name_company: item.name,
          status: element.status
        }
        this.is_list_name.push(data);
      })
    })
    // console.log(this.is_list_name)
  }

  getStatus(data: any) {
    if (data && data.status) {
      return this.status.filter((p: any) => p.value == data.status)[0].name;
    } else return ''
  }

  getDateTime(data: any) {
    return (new Date());
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
