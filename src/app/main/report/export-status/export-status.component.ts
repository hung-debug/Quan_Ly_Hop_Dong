import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

export interface ExportStatus {
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  url?: string;
  id: any
}

@Component({
  selector: 'app-export-status',
  templateUrl: './export-status.component.html',
  styleUrls: ['./export-status.component.scss']
})
export class ExportStatusComponent {
  @Input() exportStatuses: ExportStatus[] = [];

  cancelExport(id: string) {
    AppComponent.exportStatuses = AppComponent.exportStatuses.filter(item => item.id !== id);
  }

  cancelReport() {
    AppComponent.exportStatuses = [];
  }

  downloadExport(id: string, filename: string) {
    const statusIndex = AppComponent.exportStatuses.findIndex(s => s.id === id);
    if (statusIndex !== -1) {
      const status = AppComponent.exportStatuses[statusIndex];
      if (status.status === 'completed' && status.url) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = status.url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(status.url);
        a.remove();
      }
    }
  }
}