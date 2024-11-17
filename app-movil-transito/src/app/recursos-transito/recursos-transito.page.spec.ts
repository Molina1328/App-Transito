import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecursosTransitoPage } from './recursos-transito.page';

describe('RecursosTransitoPage', () => {
  let component: RecursosTransitoPage;
  let fixture: ComponentFixture<RecursosTransitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosTransitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
