import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirEspaciosComponent } from './anadir-espacios.component';

describe('AnadirEspaciosComponent', () => {
  let component: AnadirEspaciosComponent;
  let fixture: ComponentFixture<AnadirEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirEspaciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
