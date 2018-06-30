import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestricterComponent } from './restricter.component';

describe('RestricterComponent', () => {
  let component: RestricterComponent;
  let fixture: ComponentFixture<RestricterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestricterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestricterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
