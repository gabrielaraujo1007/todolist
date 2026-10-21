package tasks.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    String title,
    String description,
    boolean done,
    @JsonProperty("created_at")
    LocalDateTime createdAt
) {}