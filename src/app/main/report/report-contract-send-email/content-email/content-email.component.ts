import { Component, OnInit, ViewChild, Inject,ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportService } from '../../report.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './content-email.component.html',
  styleUrls: ['./content-email.component.scss']
})

export class ContentEmailComponent implements OnInit {
  currentOrgId: string = "";
  datas: any;
  submitted = false;
  id: any;
  content: any;
  htmlContent : any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContentEmailComponent>,
    public dialog: MatDialog,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.reportService.detailContentEmailReport(this.data.id).subscribe(
      (res: any) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(res);
        setTimeout(() => {
          this.removeAnchorTags();
        });
      },
      error => {
        console.error('Lỗi khi lấy nội dung HTML:', error);
      }
    )
  }

  private removeAnchorTags() {
    // Sử dụng Renderer2 để thao tác với DOM an toàn
    const element = this.el.nativeElement;

    // Tìm tất cả thẻ anchor trong nội dung HTML
    const anchorTags = element.querySelectorAll('a');

    // Xóa mỗi thẻ anchor
    anchorTags.forEach((anchorTag :any) => {
      this.renderer.removeChild(anchorTag.parentNode, anchorTag);
    });
  }

}
