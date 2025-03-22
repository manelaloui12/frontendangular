import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAddComponent } from './claim-add.component';

describe('ClaimAddComponent', () => {
  let component: ClaimAddComponent;
  let fixture: ComponentFixture<ClaimAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
