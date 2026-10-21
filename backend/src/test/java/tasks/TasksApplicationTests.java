
package tasks;

import tasks.controller.TaskController;
import tasks.dto.TaskRequest;
import tasks.dto.TaskResponse;
import tasks.service.TaskService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
class TaskControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Test
    void deveRejeitarTituloVazio() throws Exception {
        mockMvc.perform(post("/tasks")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                        "title": "",
                        "description": "Descrição",
                        "done": false
                    }
                    """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRejeitarTituloComApenasEspacos() throws Exception {
        mockMvc.perform(post("/tasks")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                        "title": "   ",
                        "description": "Descrição",
                        "done": false
                    }
                    """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRejeitarTituloMaiorQue150Caracteres() throws Exception {
        String titulo = "a".repeat(151);

        String json = """
            {
                "title": "%s",
                "description": "Descrição",
                "done": false
            }
            """.formatted(titulo);

        mockMvc.perform(post("/tasks")
                .contentType(APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveCriarTarefaComTituloValido() throws Exception {
        TaskResponse resposta = new TaskResponse(
                1L,
                "Estudar Java",
                "Estudar validações",
                false,
                LocalDateTime.now()
        );

        when(taskService.criar(any(TaskRequest.class)))
                .thenReturn(resposta);

        mockMvc.perform(post("/tasks")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                        "title": "Estudar Java",
                        "description": "Estudar validações",
                        "done": false
                    }
                    """))
                .andExpect(status().isCreated());
    }
}
