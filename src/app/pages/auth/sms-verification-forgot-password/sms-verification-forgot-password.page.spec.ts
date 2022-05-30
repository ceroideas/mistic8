import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmsVerificationForgotPasswordPage } from './sms-verification-forgot-password.page';

describe('SmsVerificationForgotPasswordPage', () => {
  let component: SmsVerificationForgotPasswordPage;
  let fixture: ComponentFixture<SmsVerificationForgotPasswordPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsVerificationForgotPasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmsVerificationForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
