import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarBovedasComponent } from './editar-bovedas.component';

describe('EditarBovedasComponent', () => {
  let component: EditarBovedasComponent;
  let fixture: ComponentFixture<EditarBovedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarBovedasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarBovedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
