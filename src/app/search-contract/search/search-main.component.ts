import { Component, OnInit } from '@angular/core';
import { SearchEcontract } from 'src/app/service/search-econtract';
import { ToastService } from 'src/app/service/toast.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProcessingHandleEcontractComponent } from '../processing-handle-search-econtract/processing-handle-econtract.component';
import { MatDialog } from '@angular/material/dialog';
import { ContractDataService } from 'src/app/service/contract-data.service'; 

@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.scss']
})
export class SearchMain implements OnInit {
  typeList: Array<any> = [];
  contracts: Array<any> = [];
  page: number = 10;
  totalElements: number = 0;
  p: number = 0;
  sizeOptions: any[] = [1, 10, 20, 50, 100];
  filter_status: any = "";
  color: any;
  backgroundColor: any;
  status: string;
  inputTimeout: any;
  inputSearch: string = '';
  selectedType: any = null;  // Define selectedType here
  constructor(
    private spinner: NgxSpinnerService,
    private searchEcontract: SearchEcontract,
    private toastService: ToastService,
    private router: Router,
    private dialog: MatDialog,
    private contractDataService: ContractDataService
  ) { 
    
  }

  async ngOnInit(): Promise<void> {
    const tokenString = localStorage.getItem('currentUserSearchEcontract');
    let token = tokenString ? JSON.parse(tokenString) : null;
    if (!token) {
      this.router.navigate(['/tra-cuu/login']);
    }
    let organization = token.orderIds;

    let newOption = {
      id: organization.map((item: any) => item.id).join(','),
      name: "Tất cả tổ chức"
    };

    organization.unshift(newOption)
    this.typeList = organization;
    this.selectedType = newOption.id; 
    this.getContractList();
  }

  convertStatusStr(status: any) {
    if (status == 0) {
      this.color = '#DDBC0A';
      this.backgroundColor = '#DDBC0A1A';
      return 'Bản nháp';
    } else if (status == 20) {
      this.color = '#2D6BE7';
      this.backgroundColor = '#EEF5FF';
      return 'Đang xử lý';
    } else if (status == 33) {
      this.color = '#F6AA51';
      this.backgroundColor = '#F6AA511A';
      return 'Sắp hết hạn';
    } else if (status == 34) {
      this.color = '#525963';
      this.backgroundColor = '#5259631A';
      return 'Quá hạn';
    } else if (status == 31) {
      this.color = '#F05046';
      this.backgroundColor = '#F050461A';
      return 'Từ chối';
    } else if (status == 32) {
      this.color = '#EA328B';
      this.backgroundColor = '#EA328B1A';
      return 'Hủy bỏ';
    } else if (status == 30) {
      this.color = '#24BD33';
      this.backgroundColor = '#24BD331A';
      return 'Hoàn thành';
    } else if (status == 40) {
      this.color = '#23D2EA';
      this.backgroundColor = '#23D2EA1A';
      return 'Đã thanh lý';
    }
  }

  renderOrganization(org: any, index: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const label = index < alphabet.length ? alphabet[index] : alphabet[alphabet.length - 1];
    return `Bên ${label}: ${org.name}`;
  }
  
  changePageNumber(e: any){   
    this.page = e.target.value;
    this.getContractList();
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.inputSearch = inputValue;
    clearTimeout(this.inputTimeout);

    this.inputTimeout = setTimeout(() => {
      this.getContractList();
    }, 1000);
  }

  onDropdownChange(event: any) {
    if(!event.value) {
      this.selectedType = '';
    } else {
      this.selectedType = event.value;
    }
    this.getContractList();
  }
  
  async getContractList() {
    try {
      let totalPages = Math.ceil(this.totalElements / this.page);      
      if (this.p >= totalPages) {
        this.p = 0
      }
      this.spinner.show();
      const data = await this.searchEcontract.getRoleList(this.inputSearch, this.selectedType, this.p, this.page).toPromise();
      this.contracts = data.entities;
      this.totalElements = data.total_elements;
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
      this.router.navigate(['/tra-cuu/login']);
      return this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý.', '', 3000);
    }
  }

  processHandleContract(contractId: any) {
    let processData: any = {
      is_data_contract: {
        id: null
      },
      content: null,
    }
    processData.is_data_contract.id = contractId
    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
      width: '1000px',
      backdrop: 'static',
      keyboard: true,
      data: processData
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result;
    });
  }

  setSelectedItem(item: any) {
    this.contractDataService.setItem(item);
    this.router.navigate(['tra-cuu/main/detai']);
  }

  returnToPage() {
    this.router.navigate(['tra-cuu/login']);
  }

  downloadContract(files: any) {
    let pdfUrl;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 2) {
        pdfUrl = files[i].path;
      }
    }
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'document.pdf';
    link.click();
  }
  
}
