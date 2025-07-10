package com.example.demo.model;

import lombok.Data;

@Data
public class CodeReviewRequest {
    private String code;
    private Long questionId;
}
