
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  id: number | null = null;
  title = '';
  description = '';
  done = false;
  loading = false;
  saving = false;
  error = '';

  get editando(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),

      switchMap(idParam => {
        if (idParam === null) {
          this.id = null;
          return of(null);
        }

        const id = Number(idParam);

        if (!Number.isInteger(id) || id <= 0) {
          this.error = 'Identificador de tarefa inválido.';
          return of(null);
        }

        this.id = id;
        this.loading = true;
        this.error = '';

        return this.taskService.buscarPorId(id).pipe(
          tap(task => {
            this.title = task.title;
            this.description = task.description ?? '';
            this.done = task.done;
            this.loading = false;
          }),
          catchError(() => {
            this.error = 'Não foi possível carregar a tarefa.';
            this.loading = false;
            return of(null);
          })
        );
      }),

      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  salvar(): void {
    if (this.saving || this.loading || !this.title.trim()) {
      return;
    }

    const task: Task = {
      title: this.title.trim(),
      description: this.description.trim(),
      done: this.done
    };

    this.saving = true;
    this.error = '';

    const request = this.id === null
      ? this.taskService.criar(task)
      : this.taskService.atualizar({ ...task, id: this.id });

    request.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.error = this.editando
          ? 'Não foi possível salvar as alterações.'
          : 'Não foi possível criar a tarefa.';

        this.saving = false;
      }
    });
  }
}
