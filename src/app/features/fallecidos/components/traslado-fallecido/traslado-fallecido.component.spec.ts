import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasladoFallecidoComponent } from './traslado-fallecido.component';

describe('TrasladoFallecidoComponent', () => {
  let component: TrasladoFallecidoComponent;
  let fixture: ComponentFixture<TrasladoFallecidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrasladoFallecidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrasladoFallecidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
