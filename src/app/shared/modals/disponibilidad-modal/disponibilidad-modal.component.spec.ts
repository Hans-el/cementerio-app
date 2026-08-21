import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadModalComponent } from './disponibilidad-modal.component';

describe('DisponibilidadModalComponent', () => {
  let component: DisponibilidadModalComponent;
  let fixture: ComponentFixture<DisponibilidadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibilidadModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisponibilidadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
