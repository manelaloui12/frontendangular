import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDeleteComponent } from './claim-delete.component';

describe('ClaimDeleteComponent', () => {
  let component: ClaimDeleteComponent;
  let fixture: ComponentFixture<ClaimDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
