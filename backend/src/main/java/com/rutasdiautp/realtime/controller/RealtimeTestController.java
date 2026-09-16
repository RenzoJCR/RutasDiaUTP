package com.rutasdiautp.realtime.controller;

import com.rutasdiautp.realtime.dto.RealtimePingRequest;
import com.rutasdiautp.realtime.dto.RealtimePingResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
public class RealtimeTestController {

    @MessageMapping("/system/ping")
    @SendTo("/topic/system")
    public RealtimePingResponse ping(RealtimePingRequest request) {

        return new RealtimePingResponse(
                request.message(),
                Instant.now()
        );
    }
}