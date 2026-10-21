
package tasks.controller;

import tasks.dto.TaskRequest;
import tasks.dto.TaskResponse;
import tasks.service.TaskService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> listar() {
        return taskService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> buscarPorId(
            @PathVariable Long id) {

        return taskService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskResponse> criar(
            @Valid @RequestBody TaskRequest dados) {

        TaskResponse salva = taskService.criar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest dados) {

        return taskService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        if (!taskService.excluir(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
