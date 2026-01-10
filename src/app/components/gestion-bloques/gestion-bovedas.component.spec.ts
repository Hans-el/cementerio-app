import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBovedasComponent } from './gestion-bovedas.component';

describe('GestionBovedasComponent', () => {
  let component: GestionBovedasComponent;
  let fixture: ComponentFixture<GestionBovedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionBovedasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionBovedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
