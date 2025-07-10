package com.example.demo.model;

import lombok.Data;

@Data
public class ChatEntry {
    private int id;
    private String sender;
    private String message;
}
