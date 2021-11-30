import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './pages/dash/dash.component';
import { StakingComponent } from './pages/staking/staking.component';
import { RedPandaComponent } from './pages/redpanda/redpanda.component';
import { ExchangeComponent } from './pages/exchange/exchange.component';
import { WorldofwavesComponent } from './pages/worldofwaves/worldofwaves.component';
import { BridgeComponent } from './pages/bridge/bridge.component';

const routes: Routes = [
  { path: '', redirectTo: 'lottery', pathMatch: 'full' },
  { path: 'lottery', component: DashComponent},
  { path: 'Lottery', redirectTo: 'lottery', pathMatch: 'full'},
  { path: 'Staking', redirectTo: 'staking', pathMatch: 'full'},
  { path: 'staking', component: StakingComponent},
  { path: 'Bridge', redirectTo: 'bridge', pathMatch: 'full'},
  { path: 'bridge', component: BridgeComponent},
  { path: 'Redpanda earth', redirectTo: 'redpanda-earth', pathMatch: 'full'},
  { path: 'redpanda earth', redirectTo: 'redpanda-earth', pathMatch: 'full'},
  { path: 'World Of Waves', redirectTo: 'world-of-waves', pathMatch: 'full'},
  { path: 'world of waves', redirectTo: 'world-of-waves', pathMatch: 'full'},
  { path: 'world-of-waves', component: WorldofwavesComponent},
  { path: 'redpanda-earth', component: RedPandaComponent},
  { path: 'Exchange', redirectTo: 'exchange', pathMatch: 'full'},
  { path: 'exchange', component: ExchangeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
