import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './pages/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashComponent } from './pages/dash/dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CardComponent } from './pages/card/card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table'  
import { MatTabsModule } from '@angular/material/tabs';

import { StatsService } from './services/stats.service';
import { MiniCardComponent } from './shared/mini-card/mini-card.component';
import { EnterDrawCardComponent } from './shared/enter-draw-card/enter-draw-card.component';
import { DrawStatsCardComponent } from './shared/draw-stats-card/draw-stats-card.component';
import { PlatformCheckerService } from 'src/app/services/platform.service';
import { InfoCardComponent } from './shared/info/info-card.component';
import { WinnerModalComponent } from './shared/winner-modal/winner-modal/winner-modal.component';
import { LoserModalComponent } from './shared/winner-modal/loser-modal/loser-modal.component';
import { StakingComponent } from './pages/staking/staking.component';
import { StakeCardComponent } from './shared/stake-card/stake-card.component';
import { HarvestCardComponent } from './shared/harvest-card/harvest-card.component';
import { TicketsBoughtModalComponent } from './shared/tickets-bought-modal/tickets-bought-modal.component';
import { StakingInfoComponent } from './shared/staking-info/staking-info.component';
import { MyWinsModalComponent } from './shared/my-wins-modal/my-wins-modal.component';
import { PreviousWinnersModalComponent } from './shared/previous-winners-modal/previous-winners-modal.component';
import { ConnectionModalComponent } from './shared/connection-modal/connection-modal.component';
import { GiftModalComponent } from './shared/gift-modal/gift-modal.component';
import { RedPandaComponent } from './pages/redpanda/redpanda.component';
import { RedpandaInfoCardComponent } from './shared/redpanda-info-card/redpanda-info-card.component';
import { RedPandaVideoComponent } from './shared/redpanda-video/redpanda-video.component';
import { NgxTweetModule } from "ngx-tweet";
import { RedPandaExplainerCardComponent } from './shared/redpanda-explainer-card/redpanda-explainer-card.component';
import { ExchangeComponent } from './pages/exchange/exchange.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashComponent,
    CardComponent,
    MiniCardComponent,
    EnterDrawCardComponent,
    DrawStatsCardComponent,
    InfoCardComponent,
    WinnerModalComponent,
    LoserModalComponent,
    StakingComponent,
    StakeCardComponent,
    HarvestCardComponent,
    TicketsBoughtModalComponent,
    StakingInfoComponent,
    MyWinsModalComponent,
    PreviousWinnersModalComponent,
    ConnectionModalComponent,
    GiftModalComponent,
    RedPandaComponent,
    RedpandaInfoCardComponent,
    RedPandaVideoComponent,
    RedPandaExplainerCardComponent,
    ExchangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    HttpClientModule,
    MatTableModule,
    MatTabsModule,
    NgxTweetModule
  ],
  providers: [
    StatsService,
    PlatformCheckerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
