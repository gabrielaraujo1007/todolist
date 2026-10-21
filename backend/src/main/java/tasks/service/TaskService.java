
package tasks.service;

import tasks.dto.TaskRequest;
import tasks.dto.TaskResponse;
import tasks.model.Task;
import tasks.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> listarTodas() {
        return taskRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public Optional<TaskResponse> buscarPorId(Long id) {
        return taskRepository.findById(id)
                .map(this::paraResponse);
    }

    public TaskResponse criar(TaskRequest dados) {
        Task task = new Task();
        task.setTitle(dados.title());
        task.setDescription(dados.description());
        task.setDone(dados.done());

        return paraResponse(taskRepository.save(task));
    }

    public Optional<TaskResponse> atualizar(Long id, TaskRequest dados) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(dados.title());
            task.setDescription(dados.description());
            task.setDone(dados.done());

            return paraResponse(taskRepository.save(task));
        });
    }

    public boolean excluir(Long id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }

        taskRepository.deleteById(id);
        return true;
    }

    private TaskResponse paraResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isDone(),
                task.getCreatedAt()
        );
    }
}
