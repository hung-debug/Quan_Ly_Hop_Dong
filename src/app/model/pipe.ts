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
      return 'contract.status.draft';
    }else if(value == 10){
      return 'contract.status.create.complete';
    }else if(value == 20){
      return 'contract.status.processing';
    }else if(value == 30){
      return 'contract.status.complete';
    }else if(value == 31){
      return 'contract.status.fail';
    }else if(value == 32){
      return 'contract.status.cancel';
    }else if(value == 33){
      return 'contract.status.expire';
    }else if(value == 34){
      return 'contract.status.overdue';
    }else if (value == 35){
      return 'contract.status.stored'
    }else if(value == 40){
      return 'contract.status.liquidated';
    } else if(value == 1){
      return 'contract.status.wait-processing';
    } else if(value == 4){
      return 'contract.status.processed';
    } else if(value == -1){
      return 'contract.status.share';
    } else if(value == 2){
      return 'contract.status.overdue';
    }
    return 'contract.status.undefined';
  }
}
