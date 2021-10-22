import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './pages/dash/dash.component';
import { StakingComponent } from './pages/staking/staking.component';
import { CharityComponent } from './pages/charity/charity.component';

const routes: Routes = [
  { path: '', redirectTo: 'lottery', pathMatch: 'full' },
  { path: 'lottery', component: DashComponent},
  { path: 'Lottery', redirectTo: 'lottery', pathMatch: 'full'},
  { path: 'Staking', redirectTo: 'staking', pathMatch: 'full'},
  { path: 'staking', component: StakingComponent},
  { path: 'Charity', redirectTo: 'charity', pathMatch: 'full'},
  { path: 'charity', component: CharityComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
