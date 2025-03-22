import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimUpdateComponent } from './claim-update.component';

describe('ClaimUpdateComponent', () => {
  let component: ClaimUpdateComponent;
  let fixture: ComponentFixture<ClaimUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
