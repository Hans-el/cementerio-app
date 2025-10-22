import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioDifuntosComponent } from './inicio-difuntos.component';

describe('InicioDifuntosComponent', () => {
  let component: InicioDifuntosComponent;
  let fixture: ComponentFixture<InicioDifuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioDifuntosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioDifuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
