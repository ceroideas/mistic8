import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Welcome2Page } from './welcome2.page';

describe('Welcome2Page', () => {
  let component: Welcome2Page;
  let fixture: ComponentFixture<Welcome2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Welcome2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Welcome2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
