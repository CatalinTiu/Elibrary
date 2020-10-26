import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthorDetailPage } from './author-detail.page';

describe('AuthorDetailPage', () => {
  let component: AuthorDetailPage;
  let fixture: ComponentFixture<AuthorDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
