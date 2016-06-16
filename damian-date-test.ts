import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {DatePicker} from 'ng2-datepicker';

class Test {
  date: string;
}

@Component({
  template: `
    <datepicker [(ngModel)]="test.date"></datepicker>
    <datepicker [(ngModel)]="test1.date" view-format="DD.MM.YYYY" model-format="YYY-MM-DD" init-date="2017-05-12"></datepicker>
  `,
  directives: [DatePicker, FORM_DIRECTIVES]
})

class DamianDateTest {
  test: Test;
  test1: Test;

  constructor() {
    this.test = Test();
    this.test1 = Test();
  }
}
