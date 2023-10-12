import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { RoleService } from 'src/app/service/role.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-filter-list-dialog',
  templateUrl: './filter-list-dialog.component.html',
  styleUrls: ['./filter-list-dialog.component.scss']
})
export class FilterListDialogComponent implements OnInit {

  addForm: FormGroup;
  datas: any;

  dropdownOrgSettings: any = {};
  contractTypeList: Array<any> = [];
  submitted = false;

  orgList: any[] = [];
  orgListTmp: any[] = [];
  

  filter_type:any;
  filter_contract_no:any;
  filter_from_date:any;
  filter_to_date:any;
  status:any;
  isOrg:any="";
  organization_id:any;
  selectedNodeOrganization:any;
  isQLHD_03: boolean | undefined;

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private unitService : UnitService,
    public dialogRef: MatDialogRef<FilterListDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractTypeService : ContractTypeService,
    private userService: UserService,
    private roleService: RoleService
    ) { 
    }

  ngOnInit(): void {
    this.organization_id = Number(this.data.organization_id);

    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data?.role_id).subscribe(
          data => {
            let listRole: any[];
            listRole = data.permissions;
            this.isQLHD_03 = listRole.some(element => element.code == 'QLHD_03');
        }, error => {
        });
    }, error => {}
    )

    //lay danh sach to chuc
    this.contractTypeService.getContractTypeList("", "").subscribe(data => {
      this.contractTypeList = data;
    });

    this.unitService.getUnitList('', '').subscribe(data => {
      if(this.data.filter_is_org_me_and_children){
        this.orgListTmp.push({name: "Tất cả", id:""});
      }
      let dataUnit = data.entities.sort((a:any,b:any) => a.path.toString().localeCompare(b.path.toString()));
      for(var i = 0; i < dataUnit.length; i++){
        this.orgListTmp.push(dataUnit[i]);
      }
      
      this.orgList = this.orgListTmp;
      this.selectedNodeOrganization = this.orgList.filter((p: any) => p.id == this.organization_id);
      this.convertData();


      this.filter_type = this.data.filter_type?Number(this.data.filter_type):"";
      this.filter_contract_no = this.data.filter_contract_no;
      this.filter_from_date = this.data.filter_from_date?new Date(this.data.filter_from_date):"";
      this.filter_to_date = this.data.filter_to_date?new Date(this.data.filter_to_date):"";
      this.status = this.data.status;
      this.isOrg = this.data.isOrg;
      this.organization_id = this.data.organization_id?Number(this.data.organization_id):"";
            
      let dataOrg:any="";
      dataOrg = {
        label: this.selectedNodeOrganization?this.selectedNodeOrganization[0].name:"Tất cả", 
        data: this.selectedNodeOrganization?this.selectedNodeOrganization[0].id:"",
        expanded: true,
      };
      this.selectedNodeOrganization = [];
      this.selectedNodeOrganization.push(dataOrg);
    });    
    this.isOrg = this.data.isOrg;
  }

  onSubmit() {
    const data = {
      filter_type: this.filter_type,
      filter_contract_no: this.filter_contract_no,
      filter_from_date: this.filter_from_date,
      filter_to_date: this.filter_to_date,
      status: this.status,
      isOrg: this.isOrg,
      organization_id: this.organization_id
    }
    this.dialogRef.close();
    
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/contract/create/' + data.status],
      {
        queryParams: {
          'filter_type': data.filter_type, 
          'filter_contract_no': data.filter_contract_no,
          'filter_from_date': data.filter_from_date,
          'filter_to_date': data.filter_to_date,
          'isOrg': data.isOrg,
          'organization_id': data.organization_id,
        },
        skipLocationChange: true
      });
    });
  }

  array_empty: any = [];
  listOrgCombobox: any[];
  convertData(){
    this.array_empty=[];
    this.orgList.forEach((element: any, index: number) => {

      let is_edit = false;
      let dataChildren = this.findChildren(element);
      let data:any="";
      data = {
        label: element.name, 
        data: element.id,
        expanded: true,
        children: dataChildren
      };
      
      this.array_empty.push(data);
      //this.removeElementFromStringArray(element.id);
    })
    this.listOrgCombobox = this.array_empty;
  }

  findChildren(element:any){
    let dataChildren:any[]=[];
    let arrCon = this.orgList.filter((p: any) => p.parent_id == element.id);
    
    arrCon.forEach((elementCon: any, indexCOn: number) => {      
      dataChildren.push(
      {
        label: elementCon.name, 
        data: elementCon.id,
        expanded: true,
        children: this.findChildren(elementCon)
      });
      this.removeElementFromStringArray(elementCon.id);
    })
    return dataChildren;
  }

  removeElementFromStringArray(element: string) {
    this.orgList.forEach((value,index)=>{
        if(value.id==element){
          this.orgList.splice(index,1);
        }
        
    });
  }

  changeOrg(){
    this.organization_id = this.selectedNodeOrganization?this.selectedNodeOrganization.data:"";   
  }

}
