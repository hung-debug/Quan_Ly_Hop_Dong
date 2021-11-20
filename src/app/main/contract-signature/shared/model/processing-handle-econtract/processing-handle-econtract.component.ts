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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      userForm: any;
      partnerForm: any;
      content: any},
    public router: Router,
    public dialog: MatDialog,
    // public name: LoginComponent
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.data.userForm.userDocs.forEach((item: any) => {
      item['name_company'] = this.data.userForm.name;
      this.is_list_name.push(item);
    })
    this.data.userForm.userSigns.forEach((item: any) => {
      item['name_company'] = this.data.userForm.name;
      this.is_list_name.push(item)
    })
    this.data.userForm.userViews.forEach((item: any) => {
      item['name_company'] = this.data.userForm.name;
      this.is_list_name.push(item);
    })
    this.data.partnerForm.partnerArrs.forEach((element: any) => {
      if (element.partnerDocs.length > 0)
      element.partnerDocs.forEach((item: any) => {
        item['name_company'] = element.name
        this.is_list_name.push(item)
      })
      if (element.partnerLeads.length > 0)
      element.partnerLeads.forEach((item: any) => {
        item['name_company'] = element.name
        this.is_list_name.push(item);
      })
      if (element.partnerSigns.length > 0)
      element.partnerSigns.forEach((item: any) => {
        item['name_company'] = element.name
        this.is_list_name.push(item);
      })
      if (element.partnerUsers.length > 0)
      element.partnerUsers.forEach((item: any) => {
        item['name_company'] = element.name
        this.is_list_name.push(item);
      })
      if (element.partnerViews.length > 0)
      element.partnerViews.forEach((item: any) => {
        item['name_company'] = element.name
        this.is_list_name.push(item);
      })
    })
    console.log(this.is_list_name)
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
