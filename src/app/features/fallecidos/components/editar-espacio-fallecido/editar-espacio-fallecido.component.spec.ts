import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEspacioFallecidoComponent } from './editar-espacio-fallecido.component';

describe('EditarEspacioFallecidoComponent', () => {
  let component: EditarEspacioFallecidoComponent;
  let fixture: ComponentFixture<EditarEspacioFallecidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEspacioFallecidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEspacioFallecidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
