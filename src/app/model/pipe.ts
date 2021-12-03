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
    }
    return 'contract.status.undefined';
  }
}
