package com.example.demo.model;

import lombok.Data;
import java.util.List;

@Data
public class CodeReviewRequest {
    private Long questionId;
    private String username;
    private String finalCode;
    private List<String> chatHistory;
    private boolean timeExpired;
}
