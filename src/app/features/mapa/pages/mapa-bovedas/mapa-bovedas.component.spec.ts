import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaBovedasComponent } from './mapa-bovedas.component';

describe('MapaBovedasComponent', () => {
  let component: MapaBovedasComponent;
  let fixture: ComponentFixture<MapaBovedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaBovedasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaBovedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
