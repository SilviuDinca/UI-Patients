import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPatients } from '../IPatients';

@Component({
  selector: 'app-patients-details',
  templateUrl: './patients-details.component.html',
  styleUrls: ['./patients-details.component.scss']
})
export class PatientsDetailsComponent implements OnInit, OnChanges {
  @Input() patients: IPatients[] = []
  @Input() patientDetail: IPatients[] = []


  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {

  }

  btnParentUpdate(data: IPatients[]) {
    this.patientDetail = data
  }

}
