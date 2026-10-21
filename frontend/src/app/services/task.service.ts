
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap
} from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  description: string;
  done: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8080/tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);

  readonly tarefas$ = this.tasksSubject.asObservable();

  listar(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  buscarPorId(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  criar(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(novaTask => {
        this.tasksSubject.next([
          ...this.tasksSubject.value,
          novaTask
        ]);
      })
    );
  }

  atualizar(task: Task): Observable<Task> {
    if (task.id === undefined) {
      throw new Error('O ID da tarefa é obrigatório para atualizar.');
    }

    return this.http.put<Task>(
      `${this.apiUrl}/${task.id}`,
      task
    ).pipe(
      tap(atualizada => {
        const tarefas = this.tasksSubject.value.map(item =>
          item.id === atualizada.id ? atualizada : item
        );

        this.tasksSubject.next(tarefas);
      })
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tasksSubject.next(
          this.tasksSubject.value.filter(task => task.id !== id)
        );
      })
    );
  }
}
