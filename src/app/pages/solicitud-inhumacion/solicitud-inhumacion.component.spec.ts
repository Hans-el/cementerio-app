import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudInhumacionComponent } from './solicitud-inhumacion.component';

describe('SolicitudInhumacionComponent', () => {
  let component: SolicitudInhumacionComponent;
  let fixture: ComponentFixture<SolicitudInhumacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudInhumacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudInhumacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
