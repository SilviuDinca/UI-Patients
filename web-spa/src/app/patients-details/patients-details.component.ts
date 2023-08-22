import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPatients } from '../IPatients';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-patients-details',
  templateUrl: './patients-details.component.html',
  styleUrls: ['./patients-details.component.scss'],
})
export class PatientsDetailsComponent implements OnInit, OnChanges {
  @Input() patients: IPatients[] = []
  @Input() patientDetail: IPatients[] = []
  @Input() addPatient: FormGroup
  @Input() valueBirthday: string | number
  @Input() checkResidence: boolean
  @Input() residenceStreet: string
  @Input() residenceNumberStreet: number
  @Input() residenceBuilding: string | number
  @Input() residenceFloor: number
  @Input() residenceApartment: number
  @Input() residenceCounty: string | number
  @Input() residenceCity: string
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.condition()
    // this.patientDetail.forEach((patient) => {
    //   if (patient.birthday !== null) {
    //     this.valueBirthday = patient.birthday
    //   } else if (patient.birthday === null) {
    //     this.valueBirthday = this.valueBirthday
    //   }
    // })

    this.patientDetail.forEach((patient) => {
      this.residenceStreet = patient.residenceAddress.residenceStreet
      this.residenceNumberStreet = patient.residenceAddress.residenceNumberStreet
      this.residenceBuilding = patient.residenceAddress.residenceBuilding
      this.residenceFloor = patient.residenceAddress.residenceFloor
      this.residenceApartment = patient.residenceAddress.residenceApartment
      this.residenceCounty = patient.residenceAddress.residenceCounty
      this.residenceCity = patient.residenceAddress.residenceCity
    })
  }

  ngOnInit(): void {
    this.patients.forEach((patient) => {
      this.residenceStreet = patient.residenceAddress.residenceStreet
      this.residenceNumberStreet = patient.residenceAddress.residenceNumberStreet
      this.residenceBuilding = patient.residenceAddress.residenceBuilding
      this.residenceFloor = patient.residenceAddress.residenceFloor
      this.residenceApartment = patient.residenceAddress.residenceApartment
      this.residenceCounty = patient.residenceAddress.residenceCounty
      this.residenceCity = patient.residenceAddress.residenceCity
    })
  }

  condition() {
    if (this.addPatient.get('residenceAddress.residenceCheck').value === true) {
      this.addPatient.get('residenceAddress.residenceStreet').setValue(this.addPatient.get('addressHome.street').value)
      this.addPatient.get('residenceAddress.residenceNumberStreet').setValue(this.addPatient.get('addressHome.numberStreet').value)
      this.addPatient.get('residenceAddress.residenceBuilding').setValue(this.addPatient.get('addressHome.building').value)
      this.addPatient.get('residenceAddress.residenceFloor').setValue(this.addPatient.get('addressHome.floor').value)
      this.addPatient.get('residenceAddress.residenceApartment').setValue(this.addPatient.get('addressHome.apartment').value)
      this.addPatient.get('residenceAddress.residenceCounty').setValue(this.addPatient.get('addressHome.county').value)
      this.addPatient.get('residenceAddress.residenceCity').setValue(this.addPatient.get('addressHome.city').value)
    }
  }

  btnParentUpdate(data: IPatients[]) {
    this.patientDetail = data
  }
}
