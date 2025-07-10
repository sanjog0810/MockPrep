package com.example.demo.model;

import lombok.Data;

@Data
public class UserQueryRequest {
    private Long questionId;
    private String userQuestion;
}
