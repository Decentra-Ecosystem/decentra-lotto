import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './pages/dash/dash.component';
import { StakingComponent } from './pages/staking/staking.component';
import { RedPandaComponent } from './pages/redpanda/redpanda.component';
import { ExchangeComponent } from './pages/exchange/exchange.component';
import { WorldofwavesComponent } from './pages/worldofwaves/worldofwaves.component';
import { TermsComponent } from './pages/terms/terms.component';
import { DexkitComponent } from './pages/dexkit/dexkit.component';
import { EtherlandComponent } from './pages/etherland/etherland.component';
import { MarsecosystemComponent } from './pages/marsecosystem/marsecosystem.component';
import { BridgeComponent } from './pages/bridge/bridge.component';
import { EthlotteryComponent } from './pages/ethlottery/ethlottery.component';

const routes: Routes = [
  { path: '', redirectTo: 'bsc-lottery', pathMatch: 'full' },
  { path: 'bsc-lottery', component: DashComponent},
  { path: 'bsc lottery', redirectTo: 'bsc-lottery', pathMatch: 'full'},
  { path: 'eth-lottery', component: EthlotteryComponent},
  { path: 'eth lottery', redirectTo: 'eth-lottery', pathMatch: 'full'},
  { path: 'Staking', redirectTo: 'staking', pathMatch: 'full'},
  { path: 'staking', component: StakingComponent},
  { path: 'Bridge', redirectTo: 'bridge', pathMatch: 'full'},
  { path: 'bridge', component: BridgeComponent},
  { path: 'Dexkit', redirectTo: 'dexkit', pathMatch: 'full'},
  { path: 'dexkit', component: DexkitComponent},
  { path: 'Etherland', redirectTo: 'etherland', pathMatch: 'full'},
  { path: 'etherland', component: EtherlandComponent},
  { path: 'Mars Ecosystem', redirectTo: 'marsecosystem', pathMatch: 'full'},
  { path: 'mars ecosystem', redirectTo: 'marsecosystem', pathMatch: 'full'},
  { path: 'marsecosystem', component: MarsecosystemComponent},
  { path: 'Redpanda earth', redirectTo: 'redpanda-earth', pathMatch: 'full'},
  { path: 'redpanda earth', redirectTo: 'redpanda-earth', pathMatch: 'full'},
  { path: 'World Of Waves', redirectTo: 'world-of-waves', pathMatch: 'full'},
  { path: 'world of waves', redirectTo: 'world-of-waves', pathMatch: 'full'},
  { path: 'world-of-waves', component: WorldofwavesComponent},
  { path: 'redpanda-earth', component: RedPandaComponent},
  { path: 'Exchange', redirectTo: 'exchange', pathMatch: 'full'},
  { path: 'exchange', component: ExchangeComponent},
  { path: 'Terms', redirectTo: 'terms', pathMatch: 'full'},
  { path: 'terms', component: TermsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
