
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/task-list/task-list')
        .then(m => m.TaskList)
  },
  {
    path: 'tasks/new',
    loadComponent: () =>
      import('./pages/task-form/task-form')
        .then(m => m.TaskForm)
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () =>
      import('./pages/task-form/task-form')
        .then(m => m.TaskForm)
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];
