import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css'
})
export class DatepickerComponent {
  today = inject(NgbCalendar).getToday();
  model: NgbDateStruct = this.today;
}
