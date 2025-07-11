import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Task } from '../task.interface';
import { IndexedDbService } from '../indexed-db.service';;
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatCardModule, 
    MatChipsModule, 
    MatProgressBarModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnInit {
  private routeSub!: Subscription;
  public tasks: Task[] =  [];
  
  public task?: Task;
  public isLoaded = false;
  public isEditing = false;
  public taskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]) ,
    description: new FormControl('')
  });

  constructor(private route: ActivatedRoute, 
    private indexedDBService: IndexedDbService,
    private cdr: ChangeDetectorRef) { }
    


  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      
      if (id) {
        const idNumber = Number(id);
        if (!this.task) {this.task = await this.indexedDBService.getTaskById(idNumber);}
        
        if (this.task) {
          this.taskForm.patchValue({
            title: this.task.title,
            description: this.task.description
          });
          this.isLoaded = true;
        } else {
          console.error(`Задача с ID ${idNumber} не найдена`);
        }
      } else {
        console.error('ID задачи не указан');
      }
      this.cdr.detectChanges();
    });
  }


  public edit(): void {
    this.isEditing = true;
  }

  async saveChanges() {
    this.isEditing = false;

    if (this.task) {
      this.task.title = this.taskForm.value.title || '';
      this.task.description = this.taskForm.value.description || '';
      await this.indexedDBService.updateTask(this.task);
      this.cdr.detectChanges();
    }
  }
    
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}