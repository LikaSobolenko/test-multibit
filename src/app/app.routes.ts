import { Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { NewTaskComponent } from './new-task/new-task.component';

export const routes: Routes = [
    { path: 'tasks', component: TasksListComponent  },
    { path: 'tasks/:id', component: TaskComponent },
    { path: 'new-task', component: NewTaskComponent },
    { path: '**', component: TasksListComponent  }
    ];
