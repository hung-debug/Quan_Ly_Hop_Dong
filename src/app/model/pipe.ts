import {
  Pipe,
  PipeTransform
} from '@angular/core';
@Pipe ({
  name: 'pipe'
})
export class PipeTrs implements PipeTransform {

  transform(value: number): string {
    if(value == 0){
      return 'Lưu nháp';
    }else if(value == 10){
      return 'Hoàn thành tạo hợp đồng';
    }else if(value == 20){
      return 'Đang xử lý';
    }else if(value == 30){
      return 'Đã ký (hoàn thành)';
    }else if(value == 31){
      return 'Từ chối';
    }else if(value == 32){
      return 'Huỷ bỏ';
    }
    return 'Chưa xác định';
  }
}
