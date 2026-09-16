package com.rutasdiautp.realtime.dto;

import java.time.Instant;

public record RealtimePingResponse(
        String message,
        Instant timestamp
) {
}