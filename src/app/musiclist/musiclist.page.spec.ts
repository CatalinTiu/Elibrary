import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MusiclistPage } from './musiclist.page';

describe('MusiclistPage', () => {
  let component: MusiclistPage;
  let fixture: ComponentFixture<MusiclistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusiclistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MusiclistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
