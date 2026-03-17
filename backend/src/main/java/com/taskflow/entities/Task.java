package com.taskflow.entities;

import com.taskflow.entities.enums.CategoryEnum;
import com.taskflow.entities.enums.PriorityEnum;
import com.taskflow.entities.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tb_task")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private StatusEnum status;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private PriorityEnum priority;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private CategoryEnum category;

    private LocalDate date;

    @CreationTimestamp
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
}
