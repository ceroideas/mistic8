import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoadScreenPage } from './load-screen.page';

describe('LoadScreenPage', () => {
  let component: LoadScreenPage;
  let fixture: ComponentFixture<LoadScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
