import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPatients } from '../IPatients';

@Component({
  selector: 'app-update-patients',
  templateUrl: './update-patients.component.html',
  styleUrls: ['./update-patients.component.scss']
})
export class UpdatePatientsComponent implements OnInit, OnChanges {
  editPatient: FormGroup
  @Input() patients: IPatients[] = []
  @Input() patientDetail: IPatients[] = []
  @Output() btnUpdate = new EventEmitter<IPatients[]>()

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.editPatient = new FormGroup({
      id: new FormControl(this.patientDetail[0].id),
      lastName: new FormControl(null),
      fatherInitial: new FormControl(null),
      firstName: new FormControl(null),
      birthday: new FormControl(null),
      phoneNumber: new FormControl(null),
      address: new FormGroup({
        street: new FormControl(null),
        numberStreet: new FormControl(null),
        building: new FormControl(null),
        floor: new FormControl(null),
        apartment: new FormControl(null),
        county: new FormControl(null),
        city: new FormControl(null)
      }),
      age: new FormControl(null),
      gender: new FormControl(null, Validators.required),
      cnp: new FormControl(null),
      message: new FormControl(null)
    })

    this.editPatient.patchValue({
      lastName: this.patientDetail[0].lastName,
      fatherInitial: this.patientDetail[0].fatherInitial,
      firstName: this.patientDetail[0].firstName,
      birthday: this.patientDetail[0].birthday,
      phoneNumber: this.patientDetail[0].phoneNumber,
      address: {
        street: this.patientDetail[0].address.street,
        numberStreet: this.patientDetail[0].address.numberStreet,
        building: this.patientDetail[0].address.building,
        floor: this.patientDetail[0].address.floor,
        apartment: this.patientDetail[0].address.apartment,
        county: this.patientDetail[0].address.county,
        city: this.patientDetail[0].address.city,
      },
      age: this.patientDetail[0].age,
      gender: this.patientDetail[0].gender,
      cnp: this.patientDetail[0].cnp,
    })
  }
  setPatient() {
    this.btnUpdate.emit(this.editPatient.value)
    this.updatePatient(this.editPatient.value)
  }

  updatePatient(updatedPatient: IPatients) {
    const patientToUpdate = this.patients.map(patient => patient.id).indexOf(updatedPatient.id)
    this.patients[patientToUpdate] = updatedPatient
  }
}
