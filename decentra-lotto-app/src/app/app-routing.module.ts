import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './pages/dash/dash.component';
import { StakingComponent } from './pages/staking/staking.component';
import { RedPandaComponent } from './pages/redpanda/redpanda.component';

const routes: Routes = [
  { path: '', redirectTo: 'lottery', pathMatch: 'full' },
  { path: 'lottery', component: DashComponent},
  { path: 'Lottery', redirectTo: 'lottery', pathMatch: 'full'},
  { path: 'Staking', redirectTo: 'staking', pathMatch: 'full'},
  { path: 'staking', component: StakingComponent},
  { path: 'Redpanda earth', redirectTo: 'redpanda-earth', pathMatch: 'full'},
  { path: 'redpanda earth', redirectTo: 'redpanda-earth', pathMatch: 'full'},
  { path: 'redpanda-earth', component: RedPandaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
