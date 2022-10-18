import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBuilderComponent } from './svg-builder.component';

describe('SvgBuilderComponent', () => {
  let component: SvgBuilderComponent;
  let fixture: ComponentFixture<SvgBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
