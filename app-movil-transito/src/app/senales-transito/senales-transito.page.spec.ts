import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SenalesTransitoPage } from './senales-transito.page';

describe('SenalesTransitoPage', () => {
  let component: SenalesTransitoPage;
  let fixture: ComponentFixture<SenalesTransitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SenalesTransitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
