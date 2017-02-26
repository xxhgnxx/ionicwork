import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { WebrtcComponent } from '../webrtc/webrtc.component';
import { VoiceComponent } from '../voice/voice.component';
import { ChatComponent } from '../chat/chat.component';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = ChatComponent;
  tab3Root: any = VoiceComponent;
  tab4Root: any = WebrtcComponent;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
