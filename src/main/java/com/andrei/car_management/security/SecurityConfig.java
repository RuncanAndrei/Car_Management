package com.andrei.car_management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Dezactivează CSRF (necesar pentru POST)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/cars/**").permitAll() // Permite accesul la /cars fără autentificare
                        .anyRequest().authenticated() // Restul endpoint-urilor necesită autentificare
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Fără sesiuni

        return http.build();
    }
}
