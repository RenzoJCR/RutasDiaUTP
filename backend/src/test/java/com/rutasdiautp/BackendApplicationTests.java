package com.rutasdiautp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        properties = {
                "app.mail.enabled=false"
        }
)
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}