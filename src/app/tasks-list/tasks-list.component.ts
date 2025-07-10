import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { IndexedDbService } from '../indexed-db.service';

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
export class TasksListComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  public tasks: Task[] = [];

  constructor(
    public router: Router,
    private indexedDBService: IndexedDbService,
    private cdr: ChangeDetectorRef
    ) {}
  
  async ngOnInit() {
    this.tasks = await this.indexedDBService.getAllTasks();
    this.cdr.detectChanges();
  }

  public addNewTask(): void {
    const dialogRef = this.dialog.open(NewTaskComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
    if (result === 'success') { // или другой флаг успешного добавления
      this.tasks = await this.indexedDBService.getAllTasks();
      this.cdr.detectChanges(); // Важно при ChangeDetectionStrategy.OnPush
    }
  });
  }

  public navigateTask(id: number): void {
    console.log(`ПЕРЕХОД К ЗАДАЧЕ ${id}`)
    this.router.navigate(['/tasks', id]);
  }

  async deleteTask(id: number) {
  try {
    await this.indexedDBService.deleteTask(id);
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.cdr.detectChanges();
  } catch (error) {
    console.error('Ошибка удаления:', error);
  }
}
}