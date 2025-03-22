import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneUpdateComponent } from './panne-update.component';

describe('PanneUpdateComponent', () => {
  let component: PanneUpdateComponent;
  let fixture: ComponentFixture<PanneUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanneUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanneUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
