import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPhotoModalPage } from './new-photo-modal.page';

describe('NewPhotoModalPage', () => {
  let component: NewPhotoModalPage;
  let fixture: ComponentFixture<NewPhotoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPhotoModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPhotoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
