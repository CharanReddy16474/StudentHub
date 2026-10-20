
package com.studenthub.studenthub.controller;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {

    @GetMapping("/api/auth/csrf")
    public Map<String, String> getCsrfToken(
            HttpServletRequest request) {

        CsrfToken token = (CsrfToken) request.getAttribute(
                CsrfToken.class.getName());

        if (token == null) {
            throw new IllegalStateException(
                    "CSRF token is not available");
        }

        return Map.of(
                "token", token.getToken(),
                "parameterName", token.getParameterName()
        );
    }
}
