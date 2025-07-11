import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef
} from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndexedDbService } from '../indexed-db.service';

@Component({
  selector: 'app-new-task',
  imports: [
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule, 
    MatChipsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskComponent {
  public taskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]) ,
    description: new FormControl('')
  });

  constructor(
    private indexedDBService: IndexedDbService,
    public dialogRef: MatDialogRef<NewTaskComponent>
    ) {}

    async addTask() {
    if (this.taskForm.value.title) {
      try {
        await this.indexedDBService.addTask({
          title: this.taskForm.value.title!,
          description: this.taskForm.value.description || undefined,
          status: false
        });
        
        this.dialogRef.close('success');
      } catch (error) {
        console.error('Ошибка при добавлении задачи:', error);
      }
    }
  }
}
