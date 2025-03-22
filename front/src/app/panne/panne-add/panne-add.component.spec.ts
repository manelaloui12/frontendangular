import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneAddComponent } from './panne-add.component';

describe('PanneAddComponent', () => {
  let component: PanneAddComponent;
  let fixture: ComponentFixture<PanneAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanneAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanneAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
