import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneDeleteComponent } from './panne-delete.component';

describe('PanneDeleteComponent', () => {
  let component: PanneDeleteComponent;
  let fixture: ComponentFixture<PanneDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanneDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanneDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
