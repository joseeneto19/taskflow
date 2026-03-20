package com.taskflow.servicies;

import com.taskflow.entities.Task;
import com.taskflow.repositories.TaskRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.yaml.snakeyaml.events.Event;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task create(Task task) {
        return repository.save(task);
    }

    public List<Task> findAll() {
        return repository.findAll();
    }

    public Optional<Task> findById(UUID id) {
        return repository.findById(id);
    }

    public Task update(UUID id, Task task) {
        Task findTask = repository.getReferenceById(id);
        BeanUtils.copyProperties(task, findTask, "id");
        return repository.save(findTask);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
