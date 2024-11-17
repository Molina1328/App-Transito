import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodigoTransitoPage } from './codigo-transito.page';

describe('CodigoTransitoPage', () => {
  let component: CodigoTransitoPage;
  let fixture: ComponentFixture<CodigoTransitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoTransitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
