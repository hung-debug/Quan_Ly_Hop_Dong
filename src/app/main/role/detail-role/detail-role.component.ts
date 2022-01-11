import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-detail-role',
  templateUrl: './detail-role.component.html',
  styleUrls: ['./detail-role.component.scss']
})
export class DetailRoleComponent implements OnInit {

  name:any="";
  code:any="";
  role:any="";
  groupedRole: SelectItemGroup[];
  selectedRoleConvert: any = [];
  selectedRole: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DetailRoleComponent>,
    public router: Router,
    public dialog: MatDialog,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.roleService.getRoleById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.name = data.name,
        this.code = data.code,
        this.role = data.role,  
        this.selectedRole = this.convertRoleArr(data.permissions)
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    ); 

    this.groupedRole = [
      {
        label: "Nhóm chức năng quản lý hợp đồng",
        value: "QLHD",
        items: [
          { label: "Thêm mới hợp đồng đơn lẻ", value: "QLHD_01" },
          { label: "Sửa hợp đồng", value: "QLHD_02" },
          { label: "Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con", value: "QLHD_03" },
          { label: "Xem danh sách hợp đồng của tổ chức của tôi", value: "QLHD_04" },
          { label: "Xem danh sách hợp đồng của tôi", value: "QLHD_05" },
          { label: "Tìm kiếm hợp đồng", value: "QLHD_06" },
          { label: "Xem thông tin chi tiết hợp đồng", value: "QLHD_07" },
          { label: "Sao chép hợp đồng", value: "QLHD_08" },
          { label: "Huỷ hợp đồng", value: "QLHD_09" },
          { label: "Xem lịch sử hợp đồng", value: "QLHD_10" },
          { label: "Tạo hợp đồng liên quan", value: "QLHD_11" },
          { label: "Xem hợp đồng liên quan", value: "QLHD_12" },
          { label: "Chia sẻ hợp đồng", value: "QLHD_13" }
        ]
      },
      {
        label: "Nhóm chức năng quản lý mẫu hợp đồng",
        value: "QLMHD",
        items: [
          { label: "Thêm mới mẫu hợp đồng", value: "QLMHD_01" },
          { label: "Sửa mẫu hợp đồng", value: "QLMHD_02" },
          { label: "Tạo hợp đồng đơn lẻ theo mẫu", value: "QLMHD_03" },
          { label: "Tạo hợp đồng theo lô", value: "QLMHD_04" },
          { label: "Ngừng phát hành mẫu hợp đồng", value: "QLMHD_05" },
          { label: "Phát hành mẫu hợp đồng", value: "QLMHD_06" },
          { label: "Chia sẻ mẫu hợp đồng", value: "QLMHD_07" },
          { label: "Tìm kiếm mẫu hợp đồng", value: "QLMHD_08" },
          { label: "Xóa mẫu hợp đồng", value: "QLMHD_09" },
          { label: "Xem thông tin chi tiết mẫu hợp đồng", value: "QLMHD_10" }
        ]
      },
      {
        label: "Nhóm chức năng quản lý tổ chức",
        value: "QLTC",
        items: [
          { label: "Thêm mới tổ chức", value: "QLTC_01" },
          { label: "Sửa tổ chức", value: "QLTC_02" },
          { label: "Tìm kiếm tổ chức", value: "QLTC_03" },
          { label: "Xem thông tin chi tiết tổ chức", value: "QLTC_04" }
        ]
      },
      {
        label: "Nhóm chức năng quản lý người dùng",
        value: "QLND",
        items: [
          { label: "Thêm mới người dùng", value: "QLND_01" },
          { label: "Sửa người dùng", value: "QLND_02" },
          { label: "Tìm kiếm người dùng", value: "QLND_03" },
          { label: "Xem thông tin chi tiết người dùng", value: "QLND_04" }
        ]
      },
      {
        label: "Nhóm chức năng quản lý vai trò",
        value: "QLVT",
        items: [
          { label: "Thêm mới vai trò", value: "QLVT_01" },
          { label: "Sửa vai trò", value: "QLVT_02" },
          { label: "Xóa vai trò", value: "QLVT_03" },
          { label: "Tìm kiếm vai trò", value: "QLVT_04" },
          { label: "Xem thông tin chi tiết vai trò", value: "QLVT_05" }
        ]
      },
      {
        label: "Nhóm chức năng quản lý loại hợp đồng",
        value: "QLLHD",
        items: [
          { label: "Thêm mới loại hợp đồng", value: "QLLHD_01" },
          { label: "Sửa loại hợp đồng", value: "QLLHD_02" },
          { label: "Xóa loại hợp đồng", value: "QLLHD_03" },
          { label: "Tìm kiếm loại hợp đồng", value: "QLLHD_04" },
          { label: "Xem thông tin chi tiết loại hợp đồng", value: "QLLHD_05" }
        ]
      }
    ];
  }

  convertRoleArr(roleArr:[]){
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);
    });
    return roleArrConvert;
  }

}
