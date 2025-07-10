package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.QuestionRepo;
import com.example.demo.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class HomeCtrl {
    @Autowired
    private AiService aiService;
    @Autowired
    private QuestionRepo questionRepo;

    @GetMapping("/start/{topic}")
    public ResponseEntity<Question> startInterview(@PathVariable String topic) {
        Question question = aiService.getQuestion(topic);
        questionRepo.save(question);
        return ResponseEntity.ok(question);
    }
    @PostMapping("/review")
    public ResponseEntity<String> reviewCode(@RequestBody CodeReviewRequest request) {
        String code = request.getCode();
        Long questionId = request.getQuestionId();
        String feedback = aiService.getFeedback(code,questionId);
        return ResponseEntity.ok(feedback);
    }

    @PostMapping("/query")
    public ResponseEntity<String> handleUserQuery(@RequestBody UserQueryRequest request) {
        Long questionId = request.getQuestionId();
        String query = request.getUserQuestion();

        String aiResponse = aiService.processUserQuery(questionId, query);
        return ResponseEntity.ok(aiResponse);
    }

    @PostMapping("/end")
    public ResponseEntity<?> endInterview(@RequestBody InterviewEndRequest request) {
        String evaluation = aiService.evaluatePerformance(request);
        return ResponseEntity.ok(evaluation);
    }







}
