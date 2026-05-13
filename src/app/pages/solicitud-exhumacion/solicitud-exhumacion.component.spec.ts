import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudExhumacionComponent } from './solicitud-exhumacion.component';

describe('SolicitudExhumacionComponent', () => {
  let component: SolicitudExhumacionComponent;
  let fixture: ComponentFixture<SolicitudExhumacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudExhumacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudExhumacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
