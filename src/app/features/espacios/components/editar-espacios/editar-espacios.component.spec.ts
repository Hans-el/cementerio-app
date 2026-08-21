import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEspaciosComponent } from './editar-espacios.component';

describe('EditarEspaciosComponent', () => {
  let component: EditarEspaciosComponent;
  let fixture: ComponentFixture<EditarEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEspaciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
