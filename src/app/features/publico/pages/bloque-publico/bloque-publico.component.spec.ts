import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquePublicoComponent } from './bloque-publico.component';

describe('BloquePublicoComponent', () => {
  let component: BloquePublicoComponent;
  let fixture: ComponentFixture<BloquePublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloquePublicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloquePublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
