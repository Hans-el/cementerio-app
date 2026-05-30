import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CementeriosComponent } from './cementerios.component';

describe('CementeriosComponent', () => {
  let component: CementeriosComponent;
  let fixture: ComponentFixture<CementeriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CementeriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CementeriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
