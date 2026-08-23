import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarAccionExhumacionComponent } from './seleccionar-accion-exhumacion.component';

describe('SeleccionarAccionExhumacionComponent', () => {
  let component: SeleccionarAccionExhumacionComponent;
  let fixture: ComponentFixture<SeleccionarAccionExhumacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarAccionExhumacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarAccionExhumacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
