
package com.studenthub.studenthub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        return new HttpSessionCsrfTokenRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CsrfTokenRepository csrfTokenRepository)
            throws Exception {

        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(csrfTokenRepository)
                .csrfTokenRequestHandler(
                    new CsrfTokenRequestAttributeHandler())
                .ignoringRequestMatchers("/api/auth/register")
            )

            .authorizeHttpRequests(auth -> auth

                // Public pages
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/register.html",
                    "/login.html",
                    "/error",
                    "/favicon.ico",
                    "/api/auth/csrf"
                ).permitAll()

                // Public frontend assets
                .requestMatchers(
                    "/css/**",
                    "/js/**",
                    "/images/**"
                ).permitAll()

                // Public registration endpoint
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/register"
                ).permitAll()

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .defaultSuccessUrl("/dashboard.html", true)
                .failureUrl("/login.html?error=true")
                .permitAll()
            )

            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login.html?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }
}
