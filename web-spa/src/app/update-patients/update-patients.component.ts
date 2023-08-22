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
  @Input() checkResidence: boolean = false
  @Input() residenceStreet: string
  @Input() residenceNumberStreet: number
  @Input() residenceBuilding: string | number
  @Input() residenceFloor: number
  @Input() residenceApartment: number
  @Input() residenceCounty: string | number
  @Input() residenceCity: string
  year: string
  month: string
  day: string
  currentYear: number = new Date().getFullYear()
  currentMonth: number = new Date().getMonth()
  currentDay: number = new Date().getDay()
  listPhones: { name: string }[] = []

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.editPatient = new FormGroup({
      id: new FormControl(this.patientDetail[0].id),
      lastName: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
      fatherInitial: new FormControl(null, [Validators.pattern("[A-Z]*"), Validators.maxLength(3), Validators.minLength(1)]),
      firstName: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
      birthday: new FormControl(null),
      listPhone: new FormGroup({
        name: new FormControl(''),
      }),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern("^0[237][0-9]*$"), Validators.maxLength(10), Validators.min(0)]),
      addressHome: new FormGroup({
        street: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        numberStreet: new FormControl(null, [Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        building: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        floor: new FormControl(null, [Validators.max(99), Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        apartment: new FormControl(null, [Validators.pattern("(^[^,.]*$)"), Validators.min(0), Validators.max(9999)]),
        county: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        city: new FormControl(null, Validators.pattern("[A-Za-z -]*"))
      }),
      residenceAddress: new FormGroup({
        residenceCheck: new FormControl(null),
        residenceStreet: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        residenceNumberStreet: new FormControl(null, [Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        residenceBuilding: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        residenceFloor: new FormControl(null, [Validators.max(99), Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        residenceApartment: new FormControl(null, [Validators.max(9999), Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        residenceCounty: new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        residenceCity: new FormControl(null, Validators.pattern("[A-Za-z -]*"))
      }),
      age: new FormControl(null, [Validators.pattern("(^[^,.]*$)"), Validators.min(0), Validators.max(120)]),
      gender: new FormControl(null, [Validators.pattern("[Male|Female]*"), Validators.required]),
      cnp: new FormControl(null, [Validators.pattern("[1-8]{1}[0-9]{2}(0[1-9]{1}|[0-2]{1})(0[1-9]{1}|1[0-9]{1}|2[0-9]{1}|3[0-1]{1})(0[1-9]{1}|5[1-2]{1}|[1-4][0-9]{1})(0(0[1-9]{1}|[1-9][0-9]{1})|[1-9][0-9]{2})[0-9]{1}")]),
      message: new FormControl(null, Validators.pattern("[A-Za-z -]*"))
    })
    this.editPatient.patchValue({
      lastName: this.patientDetail[0].lastName,
      fatherInitial: this.patientDetail[0].fatherInitial,
      firstName: this.patientDetail[0].firstName,
      birthday: this.patientDetail[0].birthday,
      listPhone: {
        name: this.patientDetail[0].listPhone.name
      },
      phoneNumber: this.patientDetail[0].phoneNumber,
      addressHome: {
        street: this.patientDetail[0].addressHome.street,
        numberStreet: this.patientDetail[0].addressHome.numberStreet,
        building: this.patientDetail[0].addressHome.building,
        floor: this.patientDetail[0].addressHome.floor,
        apartment: this.patientDetail[0].addressHome.apartment,
        county: this.patientDetail[0].addressHome.county,
        city: this.patientDetail[0].addressHome.city,
      },
      residenceAddress: {
        residenceStreet: this.residenceStreet,
        residenceNumberStreet: this.residenceNumberStreet,
        residenceBuilding: this.residenceBuilding,
        residenceFloor: this.residenceFloor,
        residenceApartment: this.residenceApartment,
        residenceCounty: this.residenceCounty,
        residenceCity: this.residenceCity
      },
      age: this.patientDetail[0].age,
      gender: this.patientDetail[0].gender,
      cnp: this.patientDetail[0].cnp,
    })
    this.editPatient.get('lastName').valueChanges.subscribe(data => {
      this.changeValidator()
    })

    this.editPatient.get('firstName').valueChanges.subscribe(data => {
      this.changeValidator()
    })
    this.toggle()
  }

  ngOnInit(): void {
    this.listPhones = [
      { name: 'Home' },
      { name: 'Office' },
      { name: 'Emergency' },
      { name: 'Personal' },
    ]
  }
  setPatient() {
    this.btnUpdate.emit(this.editPatient.value)
    this.updatePatient(this.editPatient.value)
  }

  updatePatient(updatedPatient: IPatients) {
    const patientToUpdate = this.patients.map(patient => patient.id).indexOf(updatedPatient.id)
    this.patients[patientToUpdate] = updatedPatient
  }

  toggle() {
    this.checkResidence = !this.checkResidence
    if (this.checkResidence === true) {
      this.editPatient.controls.residenceAddress.disable()
    } else {
      this.editPatient.controls.residenceAddress.enable()
    }
  }

  changeValidator() {
    if (this.editPatient.get('lastName').value !== null || this.editPatient.get('firstName').value !== null) {
      this.editPatient.get('firstName').addValidators(Validators.required)
      this.editPatient.get('lastName').addValidators(Validators.required)
    } else if (this.editPatient.get('lastName').valid && this.editPatient.get('firstName').valid) {
      this.editPatient.get('firstName').clearValidators()
      this.editPatient.get('lastName').clearValidators()
    }
    this.editPatient.get('firstName').updateValueAndValidity()
    this.editPatient.get('lastName').updateValueAndValidity()
  }
  changeAge() {
    if (this.getCNP() && this.editPatient.get('cnp')?.valid) {
      if (this.getCNP()[0] === '1' || this.getCNP()[0] === '2')
        this.year = '19';
      else if (this.getCNP()[0] === '3' || this.getCNP()[0] === '4')
        this.year = '18'
      else if (this.getCNP()[0] === '5' || this.getCNP()[0] === '6')
        this.year = '20'
      this.year += this.getCNP()?.slice(1, 3)
      let age: number = this.currentYear - (+this.year)
      this.editPatient.get('age')?.setValue(age)
    }
    else if (this.getCNP() && this.editPatient.get('CNP')?.invalid) {
      this.editPatient.get('age')?.setValue(null)
    }
  }

  changeBirthday() {
    if (this.getCNP() && this.editPatient.get('cnp')?.valid) {
      this.month = this.getCNP()?.slice(3, 5)
      this.day = this.getCNP()?.slice(5, 7)
      let birthdate = `${this.year}-${this.month}-${this.day}`
      this.editPatient.get('birthday')?.setValue(birthdate)
    }
    else if (this.getCNP() && this.editPatient.get('cnp')?.invalid) {
      this.editPatient.get('birthday')?.setValue(null)
    }
  }

  checkGender(event: any) {
    if (event.target.checked == true) {
      let radioValue = event.target.value;
      console.log(radioValue);
    }
  }

  changeGender() {
    if (this.getCNP() && this.editPatient.get('cnp')?.valid) {
      this.editPatient.get('gender')?.setValue(+this.getCNP()[0] % 2 === 1 ? 'Male' : 'Female')
    }
    else if (this.getCNP() && this.editPatient.get('cnp')?.invalid) {
      this.editPatient.get('gender')?.setValue(null)
    }
  }

  getCNP() {
    return this.editPatient.get('cnp')?.value
  }
}

