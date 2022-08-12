import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-sign-many-component',
  templateUrl: './dialog-sign-many-component.component.html',
  styleUrls: ['./dialog-sign-many-component.component.scss']
})
export class DialogSignManyComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("on submit ");
  }

}
