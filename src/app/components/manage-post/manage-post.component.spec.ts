import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePostComponent } from './manage-post.component';

describe('ManagePostComponent', () => {
  let component: ManagePostComponent;
  let fixture: ComponentFixture<ManagePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePostComponent]
    });
    fixture = TestBed.createComponent(ManagePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
