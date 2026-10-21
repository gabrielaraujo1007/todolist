
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  readonly tasks$ = this.taskService.tarefas$;

  error = '';
  loading = true;

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.loading = true;

    this.taskService.listar().subscribe({
      next: () => {
        this.error = '';
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar as tarefas.';
        this.loading = false;
      }
    });
  }

  novaTarefa(): void {
    this.router.navigate(['/tasks/new']);
  }

  editar(task: Task): void {
    if (task.id !== undefined) {
      this.router.navigate(['/tasks', task.id, 'edit']);
    }
  }

  alternar(task: Task): void {
    if (task.id === undefined) return;

    this.taskService.atualizar({
      ...task,
      done: !task.done
    }).subscribe({
      error: () => {
        this.error = 'Não foi possível atualizar a tarefa.';
      }
    });
  }

  excluir(task: Task): void {
    if (task.id === undefined) return;

    if (!window.confirm(`Deseja excluir "${task.title}"?`)) {
      return;
    }

    this.taskService.excluir(task.id).subscribe({
      error: () => {
        this.error = 'Não foi possível excluir a tarefa.';
      }
    });
  }
}
