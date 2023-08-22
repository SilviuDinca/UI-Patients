import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PatientsService } from '../DAL.service';
import { IPatients } from '../IPatients';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid'

export function dateValidator(control: AbstractControl) {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  return selectedDate > currentDate ? { invalidDate: true } : null;
}

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
  @Input() addPatient: FormGroup
  uuid: string = uuidv4()
  qrCode: string
  checkResidence: boolean = true
  listPhones: { name: string }[] = []
  @Input() valueBirthday: string
  @Input() residenceStreet: string
  @Input() residenceNumberStreet: number
  @Input() residenceBuilding: string | number
  @Input() residenceFloor: number
  @Input() residenceApartment: number
  @Input() residenceCounty: string | number
  @Input() residenceCity: string
  checkRadioDefault: boolean = true
  checkRadioFiveColumns: boolean = false
  toast: boolean = false
  toastDelete: boolean = false
  year: string
  month: string
  day: string
  currentYear: number = new Date().getFullYear()
  currentMonth: number = new Date().getMonth()
  currentDay: number = new Date().getDay()

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
    return this.patients.filter((patient: IPatients) => patient.lastName.toLocaleLowerCase().includes(filterBy) || patient.firstName.toLocaleLowerCase().includes(filterBy) || patient.cnp.toLocaleString().includes(filterBy))
  }

  deletePatient(key: string) {
    this.patients.forEach((value, index) => {
      if (value.id == key) {
        this.patients.splice(index, 1)
      }
    })
    this.filteredPatients.forEach((value, index) => {
      if (value.id == key) {
        this.filteredPatients.splice(index, 1)
      }
    })
    this.patientDetail.forEach((value, index) => {
      if (value.id == key) {
        this.patientDetail.splice(index, 1)
      }
    })
    this.toastDelete = true
    setTimeout(() => {
      this.toastDelete = false
    }, 1000)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.getPatients()
    this.listPhones = [
      { name: 'Home' },
      { name: 'Office' },
      { name: 'Emergency' },
      { name: 'Personal' },
    ]

    this.addPatient = new FormGroup({
      'lastName': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
      'fatherInitial': new FormControl(null, [Validators.pattern("[A-Z]*"), Validators.maxLength(3)]),
      'firstName': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
      'birthday': new FormControl(null, dateValidator),
      'listPhone': new FormGroup({
        'name': new FormControl(''),
      }),
      'phoneNumber': new FormControl(null, [Validators.required, Validators.pattern("^0[237][0-9]*$"), Validators.maxLength(10), Validators.min(0)]),
      'addressHome': new FormGroup({
        'street': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        'numberStreet': new FormControl(null, [Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        'building': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        'floor': new FormControl(null, [Validators.max(99), Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        'apartment': new FormControl(null, [Validators.pattern("(^[^,.]*$)"), Validators.min(0), Validators.max(9999)]),
        'county': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        'city': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
      }),
      'residenceAddress': new FormGroup({
        'residenceCheck': new FormControl(null),
        'residenceStreet': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        'residenceNumberStreet': new FormControl(null, [Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        'residenceBuilding': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        'residenceFloor': new FormControl(null, [Validators.max(99), Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        'residenceApartment': new FormControl(null, [Validators.max(9999), Validators.min(0), Validators.pattern("(^[^,.]*$)")]),
        'residenceCounty': new FormControl(null, Validators.pattern("[A-Za-z -]*")),
        'residenceCity': new FormControl(null, [Validators.pattern("[A-Za-z -]*")])
      }),
      'age': new FormControl(null, [Validators.pattern("(^[^,.]*$)"), Validators.min(0), Validators.max(120)]),
      'gender': new FormControl(null, [Validators.pattern("[Male|Female]*"), Validators.required]),
      'cnp': new FormControl(null, [Validators.pattern("[1-8]{1}[0-9]{2}(0[1-9]{1}|[0-2]{1})(0[1-9]{1}|1[0-9]{1}|2[0-9]{1}|3[0-1]{1})(0[1-9]{1}|5[1-2]{1}|[1-4][0-9]{1})(0(0[1-9]{1}|[1-9][0-9]{1})|[1-9][0-9]{2})[0-9]{1}")]),
      'message': new FormControl(null, Validators.pattern("[A-Za-z -]*"))
    })
    if (this.addPatient.get('residenceAddress.residenceCheck').value === true) {
      this.addPatient.get('residenceAddress').disable()
    }

    this.addPatient.get('lastName').valueChanges.subscribe(data => {
      this.changeValidator()
    })

    this.addPatient.get('firstName').valueChanges.subscribe(data => {
      this.changeValidator()
    })

    this.toggle()
    this.sortByAge()
  }

  changeValidator() {
    if (this.addPatient.get('lastName').value !== null || this.addPatient.get('firstName').value !== null) {
      this.addPatient.get('firstName').addValidators(Validators.required)
      this.addPatient.get('lastName').addValidators(Validators.required)
    }
    this.addPatient.get('firstName').updateValueAndValidity()
    this.addPatient.get('lastName').updateValueAndValidity()
  }

  toggleCheckRadio() {
    this.checkRadioDefault = !this.checkRadioDefault
    this.checkRadioFiveColumns = !this.checkRadioFiveColumns
  }

  toggle() {
    this.checkResidence = !this.checkResidence
    if (this.checkResidence === true) {
      this.addPatient.get('residenceAddress.residenceCheck').setValue(true)
      this.addPatient.get('residenceAddress').disable()
    } else {
      this.addPatient.get('residenceAddress.residenceCheck').setValue(null)
      this.addPatient.get('residenceAddress').enable()
    }
  }

  onSubmit() {
    this.addOnePatient(this.addPatient.value)
    this.addPatient.reset()
    this.toast = true
    setTimeout(() => {
      this.toast = false
    }, 2000)
  }

  onQrCode(patient: IPatients) {
    if (patient.cnp) {
      let numbers = patient.cnp.toString().slice(7, 12)
      this.qrCode = `https://example.com/${patient.id}|${numbers}|${patient.gender}`
    }
  }

  getPatients() {
    this.sub = this.patientsService.getPatients().subscribe({
      next: patients => {
        this.patients = patients
        this.filteredPatients = this.patients
        this.toast = false
      }
    })
  }

  getPatient(id: string) {
    this.patientDetail = this.patients.filter((a) => {
      return a.id === id
    })
  }

  addOnePatient(patient: IPatients) {
    patient.id = uuidv4()

    this.checkResidenceAdress()

    if (patient.gender === null) return

    if (patient.gender === 'Male') {
      if (patient.lastName === null && patient.fatherInitial === null && patient.firstName === null) {
        patient.lastName = 'Ion'
        patient.fatherInitial = 'XY'
        patient.firstName = 'Popescu'
      }
    } else if (patient.gender === 'Female') {
      if (patient.lastName === null && patient.fatherInitial === null && patient.firstName === null) {
        patient.lastName = 'Ioana'
        patient.fatherInitial = 'XX'
        patient.firstName = 'Popescu'
      }
    }
    this.patients.push(patient)
  }

  checkResidenceAdress() {
    if (this.checkResidence === true) {
      this.residenceStreet = this.addPatient.get('addressHome.street').value
      this.residenceNumberStreet = this.addPatient.get('addressHome.numberStreet').value
      this.residenceBuilding = this.addPatient.get('addressHome.building').value
      this.residenceFloor = this.addPatient.get('addressHome.floor').value
      this.residenceApartment = this.addPatient.get('addressHome.apartment').value
      this.residenceCounty = this.addPatient.get('addressHome.county').value
      this.residenceCity = this.addPatient.get('addressHome.city').value
    } else if (this.checkResidence === false) {
      this.residenceStreet = this.addPatient.get('residenceAddress.residenceStreet').value
      this.residenceNumberStreet = this.addPatient.get('residenceAddress.residenceNumberStreet').value
      this.residenceBuilding = this.addPatient.get('residenceAddress.residenceBuilding').value
      this.residenceFloor = this.addPatient.get('residenceAddress.residenceFloor').value
      this.residenceApartment = this.addPatient.get('residenceAddress.residenceApartment').value
      this.residenceCounty = this.addPatient.get('residenceAddress.residenceCounty').value
      this.residenceCity = this.addPatient.get('residenceAddress.residenceCity').value
    }
  }

  changeAge() {
    if (this.getCNP() && this.addPatient.get('cnp')?.valid) {
      if (this.getCNP()[0] === '1' || this.getCNP()[0] === '2')
        this.year = '19';
      else if (this.getCNP()[0] === '3' || this.getCNP()[0] === '4')
        this.year = '18'
      else if (this.getCNP()[0] === '5' || this.getCNP()[0] === '6')
        this.year = '20'
      this.year += this.getCNP()?.slice(1, 3)
      let age: number = this.currentYear - (+this.year)
      this.addPatient.get('age')?.setValue(age)
    }
    else if (this.getCNP() && this.addPatient.get('CNP')?.invalid) {
      this.addPatient.get('age')?.setValue(null)
    }
  }

  changeBirthday() {
    if (this.getCNP() && this.addPatient.get('cnp')?.valid) {
      this.month = this.getCNP()?.slice(3, 5)
      this.day = this.getCNP()?.slice(5, 7)
      let birthdate = `${this.year}-${this.month}-${this.day}`
      this.addPatient.get('birthday')?.setValue(birthdate)
    }
    else if (this.getCNP() && this.addPatient.get('cnp')?.invalid) {
      this.addPatient.get('birthday')?.setValue(null)
    }
  }

  checkGender(event: any) {
    if (event.target.checked == true) {
      let radioValue = event.target.value;
      console.log(radioValue);
    }
  }

  changeGender() {
    if (this.getCNP() && this.addPatient.get('cnp')?.valid) {
      this.addPatient.get('gender')?.setValue(+this.getCNP()[0] % 2 === 1 ? 'Male' : 'Female')
    }
    else if (this.getCNP() && this.addPatient.get('cnp')?.invalid) {
      this.addPatient.get('gender')?.setValue(null)
    }
  }

  getCNP() {
    return this.addPatient.get('cnp')?.value
  }

  sortByLastName() {
    this.filteredPatients.sort((firstLastName, secondLastName) => {
      return firstLastName.lastName > secondLastName.lastName ? 1 : -1
    })
  }

  sortByFirstName() {
    this.filteredPatients.sort((a, b) => {
      return a.firstName > b.firstName ? 1 : -1
    })
  }

  sortByAge() {
    this.filteredPatients.sort((firstAge, secondAge) => {
      return firstAge.age - secondAge.age
    })
  }

  sortByGender() {
    this.filteredPatients.sort((firstGender, secondGender) => {
      return firstGender.gender > secondGender.gender ? 1 : -1
    })
  }
}
