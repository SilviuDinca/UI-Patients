import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePatientsComponent } from './update-patients.component';

describe('UpdatePatientsComponent', () => {
  let component: UpdatePatientsComponent;
  let fixture: ComponentFixture<UpdatePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
