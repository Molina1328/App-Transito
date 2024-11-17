import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  {
    path: 'codigo-transito',
    loadChildren: () => import('./codigo-transito/codigo-transito.module').then( m => m.CodigoTransitoPageModule)
  },
  {
    path: 'senales-transito',
    loadChildren: () => import('./senales-transito/senales-transito.module').then( m => m.SenalesTransitoPageModule)
  },
  {
    path: 'infracciones-transito',
    loadChildren: () => import('./infracciones-transito/infracciones-transito.module').then( m => m.InfraccionesTransitoPageModule)
  },
  {
    path: 'recursos-transito',
    loadChildren: () => import('./recursos-transito/recursos-transito.module').then( m => m.RecursosTransitoPageModule)
  },
  {
    path: 'entidades-transito',
    loadChildren: () => import('./entidades-transito/entidades-transito.module').then( m => m.EntidadesTransitoPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
