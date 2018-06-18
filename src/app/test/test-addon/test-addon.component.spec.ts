import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddonComponent } from './test-addon.component';

describe('TestAddonComponent', () => {
  let component: TestAddonComponent;
  let fixture: ComponentFixture<TestAddonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAddonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
