import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindComponent } from './blind-component';

describe('BlindComponent', () => {
  let component: BlindComponent;
  let fixture: ComponentFixture<BlindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlindComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
