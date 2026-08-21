import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirBovedaComponent } from './anadir-boveda.component';

describe('AnadirBovedaComponent', () => {
  let component: AnadirBovedaComponent;
  let fixture: ComponentFixture<AnadirBovedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirBovedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirBovedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
