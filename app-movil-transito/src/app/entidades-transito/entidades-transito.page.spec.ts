import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntidadesTransitoPage } from './entidades-transito.page';

describe('EntidadesTransitoPage', () => {
  let component: EntidadesTransitoPage;
  let fixture: ComponentFixture<EntidadesTransitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntidadesTransitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
