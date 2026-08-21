import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizarModalComponent } from './localizar-modal.component';

describe('LocalizarModalComponent', () => {
  let component: LocalizarModalComponent;
  let fixture: ComponentFixture<LocalizarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizarModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalizarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
