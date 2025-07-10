package com.example.demo.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewRequest {
    private String dsaTopic;
    private String username;

}
