import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDifuntosComponent } from './gestion-difuntos.component';

describe('GestionDifuntosComponent', () => {
  let component: GestionDifuntosComponent;
  let fixture: ComponentFixture<GestionDifuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDifuntosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDifuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
