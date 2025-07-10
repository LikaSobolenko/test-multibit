import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const idNumber = Number(id);
      this.task = this.tasks[idNumber];
      
      if (this.task) {
        this.taskForm.patchValue({
          title: this.task.title,
          description: this.task.description
        });
        this.isLoaded = true;
      } else {
        console.error(`Задача не найдена`);
      }
    } else {
      console.error('Нет id');
    }
  }

  public edit(): void {
    this.isEditing = true;
  }

  public saveChanges(): void {
    if (this.task) {
      this.task.title = this.taskForm.value.title || '';
      this.task.description = this.taskForm.value.description || '';
      this.isEditing = false;
      console.log('Обновленная задача:', this.task);
    }
  }
}