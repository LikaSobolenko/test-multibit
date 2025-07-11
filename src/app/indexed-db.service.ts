import { Injectable } from '@angular/core';
import { Task } from './task.interface';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'TasksDB';
  private storeName = 'tasks';
  private db!: IDBDatabase;
  private dbReady = new BehaviorSubject<boolean>(false);

  private initialTasks: Task[] = [{
    id: 1,
    title: "Цифровой детокс",
    description: "Провести 2 часа без гаджетов: читать бумажную книгу, гулять без телефона, вести дневник ручкой",
    status: false
  },
  {
    id: 2,
    title: "Изучение облаков",
    description: "Определить 5 типов облаков по международной классификации и сфотографировать примеры каждого",
    status: false
  },
  {
    id: 3,
    title: "Кубик Рубика",
    description: "Собрать одну грань правильно",
    status: false
  }
  ];

  constructor() {
    this.initializeDB();
  }

  private initializeDB(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      
      if (!this.db.objectStoreNames.contains(this.storeName)) {
        const store = this.db.createObjectStore(this.storeName, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('status', 'status', { unique: false });
        
        this.initialTasks.forEach(task => store.add(task));
      }
    };

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.dbReady.next(true);
      console.log('Database initialized');
    };

    request.onerror = (event: Event) => {
      console.error('Database error:', (event.target as IDBRequest).error);
    };
  }

  private async waitForDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    
    return new Promise((resolve, reject) => {
      const subscription = this.dbReady.subscribe(isReady => {
        if (isReady) {
          subscription.unsubscribe();
          resolve(this.db);
        }
      });
    });
  }

  public async addTask(task: Omit<Task, 'id'>): Promise<number> {
    const db = await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(task);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  public async getAllTasks(): Promise<Task[]> {
    const db = await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTaskById(id: number): Promise<Task | undefined> {
  const db = await this.waitForDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

  async updateTask(data: Task): Promise<void> {
    const db = await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  deleteTask(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
