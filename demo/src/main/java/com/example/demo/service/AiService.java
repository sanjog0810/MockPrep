package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.QuestionRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AiService {

    @Value("${openrouter.api.key}")
    private String apiKey;
    @Autowired
    private QuestionRepo questionRepo;

    private final String MODEL = "google/gemma-3n-e2b-it:free";
    private final String API_URL = "https://openrouter.ai/api/v1/chat/completions";
    private final String REFERER = "https://your-site-url.com"; // Change to your domain
    private final String TITLE = "MockPrep";

    private final WebClient webClient = WebClient.builder().build();

    public String getFeedback(String code, Long questionId) {
        Question q =  questionRepo.getReferenceById(questionId);
        String question = q.getDescription();
//        Example ex = (Example) q.getExamples();
        String prompt = "You're a strict technical interviewer reviewing a candidate's code.\n"
                + "Assess if the logic is correct based on the problem and test cases.\n"
                + "Respond in 3–4 lines max. No full solutions. Point out flaws directly.\n"
                + "If code is wrong or unoptimized, say so clearly. Be blunt if needed.\n"
                + "Question: " + question + "\n"
                + "Code: " + code;

        AiRequest request = new AiRequest();
        request.setPrompt(prompt);
        AiResponse response = getReply(request);
        return response.getReply();
    }

    public AiResponse getReply(AiRequest request) {
        String prompt = request.getPrompt();

        String requestBody = """
        {
          "model": "%s",
          "messages": [
            {
              "role": "user",
              "content": "%s"
            }
          ]
        }
        """.formatted(MODEL, prompt.replace("\"", "\\\""));

        return webClient.post()
                .uri(API_URL)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header("HTTP-Referer", REFERER)
                .header("X-Title", TITLE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> {
                    String content = extractContentFromJson(json);
                    return new AiResponse(content);
                }).block();
    }

    private String extractContentFromJson(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
            JsonNode choices = root.get("choices");

            if (choices != null && choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).get("message");
                if (message != null && message.has("content")) {
                    return message.get("content").asText();
                }
            }
            return "No content found in the AI response.";
        } catch (Exception e) {
            return "Failed to parse AI response.";
        }
    }

    public Question getQuestion(String topic) {
        AiRequest request = new AiRequest();
        String prompt = String.format(
                "You are CodeQuestion-Generator-v1, accessed **via an API**.\n" +
                        "\n" +
                        "IMPORTANT RULES (follow strictly):\n" +
                        "- Output ONLY a valid **raw JSON object**. No markdown, no backticks, no comments, no explanations.\n" +
                        "- Do NOT include any introductory or closing sentences.\n" +
                        "- The response must parse as a single JSON object exactly matching the schema below.\n" +
                        "\n" +
                        "TASK:\n" +
                        "- Generate a **frequently asked** coding question from real technical interviews (FAANG/startups).\n" +
                        "- The question must be strictly based on the topic: \"%s\".\n" +
                        "- The problem must be solvable using code only—no visual, UI, or diagram-based problems.\n" +
                        "- Arrays should be represented as strings like \"1 2 3\" or \"[1,2,3]\" — do NOT use real arrays in JSON.\n" +
                        "- Use clear and concise English.\n" +
                        "- Include 2-3 detailed example cases under the `examples` field.\n" +
                        "\n" +
                        "OUTPUT FORMAT (strict JSON schema):\n" +
                        "{\n" +
                        "  \"title\": string,\n" +
                        "  \"topic\": string,\n" +
                        "  \"difficulty\": \"easy\" | \"medium\" | \"hard\",\n" +
                        "  \"description\": string,\n" +
                        "  \"input_format\": string,\n" +
                        "  \"output_format\": string,\n" +
                        "  \"constraints\": string,\n" +
                        "  \"examples\": [\n" +
                        "    {\"input\": string, \"output\": string},\n" +
                        "    {\"input\": string, \"output\": string}\n" +
                        "  ]\n" +
                        "}\n" +
                        "\n" +
                        "ONLY return the JSON object. No markdown, no explanation. If you include anything else, the system will fail."
                , topic);


        request.setPrompt(prompt);

        AiResponse  response = getReply(request);
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response.getReply(), Question.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage());
        }
    }

    public String processUserQuery(Long questionId, String query) {
        Question question = questionRepo.findById(questionId).orElseThrow();

        String prompt = "You're an AI interviewer. Keep your answers short (3–4 lines), strict, and to the point.\n"
                + "Question Title: " + question.getTitle() + "\n"
                + "Description: " + question.getDescription() + "\n"
                + "Candidate asked: " + query + "\n"
                + "Respond with hints only. Be firm. If code is bad or unoptimized, say it clearly. Do not give full answers.";


        // your LLM call
        AiRequest request = new AiRequest();
        request.setPrompt(prompt);
        AiResponse response = getReply(request);
        return response.getReply();
    }

    public String evaluatePerformance(InterviewEndRequest request) {
        try {
            String prompt = buildEvaluationPrompt(request);
            AiRequest request1 = new AiRequest();
            request1.setPrompt(prompt);
            AiResponse response = getReply(request1);
            return response.getReply();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error evaluating performance.";

        }
    }
    public String buildEvaluationPrompt(InterviewEndRequest req) {
        Question question = questionRepo.getReferenceById(req.getQuestionId());

        StringBuilder chatLog = new StringBuilder();

        for (ChatEntry entry : req.getChatHistory()) {
            chatLog.append(entry.getSender().toUpperCase()).append(": ").append(entry.getMessage()).append("\n");
        }

        return """
        You are a technical interviewer analyzing a candidate's full mock coding interview session.

        Your job is to **evaluate the candidate's performance** based on:
        - The question description
        - Their final code submission
        - The entire chat transcript (conversation between candidate and AI)

        ✅ Your response MUST:
        - Be a single valid JSON object.
        - Do **not** include any markdown formatting like ```json or backticks.
        - Do **not** add any explanation before or after the JSON.
        - Do **not** wrap the JSON in any code block.
        - Do **not** respond in markdown format.
        - Only return raw, plain JSON as per the structure below.

        🎯 Evaluation JSON format (strictly adhere to this):
        {
          "passed": true or false,
          "strengths": ["list", "of", "good", "points"],
          "weaknesses": ["list", "of", "improvement", "areas"],
          "verdict": "Pass/Fail with short reason",
          "feedback": "Detailed and motivating feedback",
          "recommendations": ["Study topic X", "Practice pattern Y"]
        }

        Interview Description:
        %s

        Final Code Submission:
        %s

        Chat Transcript:
        %s
        """.formatted(
                question.getDescription(),
                req.getFinalCode(),
                chatLog.toString()
        );

    }

}

