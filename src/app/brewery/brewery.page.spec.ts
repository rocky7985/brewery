import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreweryPage } from './brewery.page';

describe('BreweryPage', () => {
  let component: BreweryPage;
  let fixture: ComponentFixture<BreweryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BreweryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
