import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksManageComponent } from './books-manage.component';

describe('BooksManageComponent', () => {
  let component: BooksManageComponent;
  let fixture: ComponentFixture<BooksManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
