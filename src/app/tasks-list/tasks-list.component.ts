import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { Task } from '../task.interface';

@Component({
  standalone: true,
  selector: 'app-tasks-list',
  imports: [
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  readonly dialog = inject(MatDialog);
  public tasks: Task[] =  [
  {
    title: "Утренняя зарядка",
    description: "15 минут упражнений для бодрости: приседания, отжимания, растяжка",
    status: false
  },
  {
    title: "Планирование дня",
    description: "Составить список важных дел и расставить приоритеты на день",
    status: false
  },
  {
    title: "Изучение английского",
    description: "Повторить 10 новых слов и посмотреть видео на английском",
    status: false
  },
  {
    title: "Прогулка",
    description: "Гулять 30 минут",
    status: false
  },
  {
    title: "Медитация",
    description: "10 минут тишины",
    status: false
  },
  {
    title: "Чтение",
    status: false
  },
  {
    title: "Запись мыслей",
    status: false
  }
];

  constructor(
    public router: Router
    ) {}

  public addNewTask(): void {
    this.dialog.open(NewTaskComponent);
  }

  public navigateTask(id: number): void {
    console.log(`ПЕРЕХОД К ЗАДАЧЕ ${id}`)
    this.router.navigate(['/tasks', id]);
  }

  public deleteTask(id: number): void {
    this.tasks.splice(id, 1);
  }
}