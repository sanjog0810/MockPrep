package com.example.demo.model;

import lombok.Data;

import java.util.List;
@Data
public class InterviewEndRequest {
    private Long questionId;
    private String username;
    private String finalCode;
    private List<ChatEntry> chatHistory;
    private boolean timeExpired;
}
