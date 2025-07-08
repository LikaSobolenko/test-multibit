import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description: string;
  status: boolean;
}

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
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent {
  public tasks: Task[] = [
    {
      id: 1,
      title: "Утренняя зарядка",
      description: "Сделать 15-минутный комплекс упражнений для бодрости",
      status: false
    },
    {
      id: 2,
      title: "Планирование дня",
      description: "Составить список дел на текущий день",
      status: false
    },
    {
      id: 3,
      title: "Работа над проектом",
      description: "Закоммитить изменения в текущий рабочий проект",
      status: false
    },
    {
      id: 4,
      title: "Прогулка",
      description: "30-минутная прогулка на свежем воздухе",
      status: false
    },
    {
      id: 5,
      title: "Чтение",
      description: "Прочитать 20 страниц книги",
      status: false
    }
  ];

  constructor(
    public router: Router
    ) {}

  public navigateTask(id: number) {
    this.router.navigate(['/tasks', id]);
    console.log(`ПЕРЕХОД К ЗАДАЧЕ ${id}`)
  }

  public deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }


}