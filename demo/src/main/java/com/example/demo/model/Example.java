package com.example.demo.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Embeddable
@Data
@Getter
@Setter
public class Example {
    private String input;
    private String output;
}
