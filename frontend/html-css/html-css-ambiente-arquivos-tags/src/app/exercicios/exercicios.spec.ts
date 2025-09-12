import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercicios } from './exercicios';

describe('Exercicios', () => {
  let component: Exercicios;
  let fixture: ComponentFixture<Exercicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exercicios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exercicios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
