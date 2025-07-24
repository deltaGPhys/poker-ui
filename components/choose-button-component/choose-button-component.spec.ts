import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseButtonComponent } from './choose-button-component';

describe('ChooseButtonComponent', () => {
  let component: ChooseButtonComponent;
  let fixture: ComponentFixture<ChooseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
