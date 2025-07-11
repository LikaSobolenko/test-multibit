import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { Task } from '../task.interface';
import { IndexedDbService } from '../indexed-db.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-tasks-list',
  imports: [
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  readonly dialog = inject(MatDialog);
  public tasks: Task[] = [];
  public displayedTasks: Task[] = [];
  public searchText: string = '';

  constructor(
    public router: Router,
    private indexedDBService: IndexedDbService,
    private cdr: ChangeDetectorRef
    ) {}
  
  async ngOnInit() {
    await this.loadTasks();
  }

  private async loadTasks() {
    this.tasks = await this.indexedDBService.getAllTasks();
    this.displayedTasks = [...this.tasks];
    this.cdr.detectChanges();
  }

  applyFilter() {
    if (!this.searchText.trim()) {
      this.loadTasks();
      return;
    }

    const term = this.searchText.toLowerCase();
    this.displayedTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(term)
    );
  }

  public addNewTask(): void {
    const dialogRef = this.dialog.open(NewTaskComponent);
    this.subs.add(
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === 'success') {
          await this.loadTasks();
        }
      })
    );
  }

  public navigateToTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  async toggleCompletion(id: number, newStatus: boolean) {
    try {
      const task = this.tasks.find(t => t.id === id);

      if (!task) return;

      task.status = newStatus;
      await this.indexedDBService.updateTask(task);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
    }
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

  public sortByTitle() {
    this.tasks.sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  }

  public sortByStatus() {
    this.tasks.sort((a, b) => (+a.status) - (+b.status));
  }
  
  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}