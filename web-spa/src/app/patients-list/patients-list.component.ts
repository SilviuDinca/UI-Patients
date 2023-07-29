import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PatientsService } from '../patients.service';
import { IPatients } from '../IPatients';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit, OnChanges {
  sub!: Subscription;
  @Input() patients: IPatients[] = []
  filteredPatients: IPatients[] = []
  patientDetail: IPatients[] = []
  addPatient: FormGroup

  private _listFilter = ''
  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredPatients = this.performFilter(value);
  }

  constructor(private patientsService: PatientsService) {
  }

  performFilter(filterBy: string): IPatients[] {
    filterBy = filterBy.toLocaleLowerCase()
    return this.patients.filter((patient: IPatients) => patient.lastName.toLocaleLowerCase().includes(filterBy) || patient.firstName.toLocaleLowerCase().includes(filterBy) || patient.cnp.toLocaleLowerCase().includes(filterBy))
  }

  delete(key: number) {
    this.filteredPatients.forEach((value, index) => {
      if (value.id == key) this.filteredPatients.splice(index, 1)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.getPatients()
    this.addPatient = new FormGroup({
      'lastName': new FormControl(null),
      'fatherInitial': new FormControl(null),
      'firstName': new FormControl(null),
      'birthday': new FormControl(null),
      'phoneNumber': new FormControl(null),
      'address': new FormGroup({
        'street': new FormControl(null),
        'numberStreet': new FormControl(null),
        'building': new FormControl(null),
        'floor': new FormControl(null),
        'apartment': new FormControl(null),
        'county': new FormControl(null),
        'city': new FormControl(null),
      }),
      'age': new FormControl(null),
      'gender': new FormControl(null, Validators.required),
      'cnp': new FormControl(null),
      'message': new FormControl(null)
    })
  }

  onSubmit() {

    this.addOnePatient(this.addPatient.value)
    this.addPatient.reset()
  }

  getPatients() {
    this.sub = this.patientsService.getPatients().subscribe({
      next: patients => {
        this.patients = patients
        this.filteredPatients = this.patients
      }
    })
  }

  getDetails(id: number) {
    console.log(this.patientDetail);

    this.patientDetail = this.patients.filter(a => a.id === id)
  }

  addOnePatient(patient: IPatients) {
    this.patients.push(patient)
  }


}
