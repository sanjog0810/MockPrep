package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
@Entity
public class Question {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String title;
        private String topic;
        private String difficulty;
        private String description;
        private String input_format;
        private String output_format;
        private String constraints;
        @ElementCollection
        @CollectionTable(name = "question_examples", joinColumns = @JoinColumn(name = "question_id"))
        private List<Example> examples;


}
