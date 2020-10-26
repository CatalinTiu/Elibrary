import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlbumDetailPage } from './album-detail.page';

describe('AlbumDetailPage', () => {
  let component: AlbumDetailPage;
  let fixture: ComponentFixture<AlbumDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
