import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirManzanaComponent } from './anadir-manzana.component';

describe('AnadirManzanaComponent', () => {
  let component: AnadirManzanaComponent;
  let fixture: ComponentFixture<AnadirManzanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirManzanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirManzanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
