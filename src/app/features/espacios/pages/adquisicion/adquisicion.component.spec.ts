import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquisicionComponent } from './adquisicion.component';

describe('AdquisicionComponent', () => {
  let component: AdquisicionComponent;
  let fixture: ComponentFixture<AdquisicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdquisicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdquisicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
