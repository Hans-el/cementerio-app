import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTramiteComponent } from './solicitud-tramite.component';

describe('SolicitudTramiteComponent', () => {
  let component: SolicitudTramiteComponent;
  let fixture: ComponentFixture<SolicitudTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudTramiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
