import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDifuntoComponent } from './editar-difunto.component';

describe('EditarDifuntoComponent', () => {
  let component: EditarDifuntoComponent;
  let fixture: ComponentFixture<EditarDifuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDifuntoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDifuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
