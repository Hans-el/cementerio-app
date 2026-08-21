import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirDifuntoComponent } from './anadir-difunto.component';

describe('AnadirDifuntoComponent', () => {
  let component: AnadirDifuntoComponent;
  let fixture: ComponentFixture<AnadirDifuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirDifuntoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirDifuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
