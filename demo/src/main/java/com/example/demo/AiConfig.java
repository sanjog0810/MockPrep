package com.example.demo;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
@Getter
@Configuration
public class AiConfig {
    @Value("${openrouter.api.key}")
    private String apiKey;
    @Value("${openrouter.api.url}")
    private String apiUrl;

}
