import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfraccionesTransitoPage } from './infracciones-transito.page';

describe('InfraccionesTransitoPage', () => {
  let component: InfraccionesTransitoPage;
  let fixture: ComponentFixture<InfraccionesTransitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraccionesTransitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
