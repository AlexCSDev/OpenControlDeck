import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDashboardControllerComponent } from './edit-dashboard-controller.component';

describe('EditDashboardControllerComponent', () => {
  let component: EditDashboardControllerComponent;
  let fixture: ComponentFixture<EditDashboardControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDashboardControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDashboardControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
