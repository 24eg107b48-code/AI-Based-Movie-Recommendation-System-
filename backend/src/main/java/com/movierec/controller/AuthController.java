package com.movierec.controller;

import com.movierec.dto.AuthResponse;
import com.movierec.dto.LoginRequest;
import com.movierec.dto.RegisterRequest;
import com.movierec.dto.UserProfileDto;
import com.movierec.entity.User;
import com.movierec.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable Long userId) {
        try {
            UserProfileDto profile = userService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile/{userId}/genres")
    public ResponseEntity<?> updateFavoriteGenres(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        String genres = body.get("favoriteGenres");
        if (genres == null) {
            return ResponseEntity.badRequest().body("favoriteGenres field required");
        }
        User updated = userService.updateFavoriteGenres(userId, genres);
        return ResponseEntity.ok(updated);
    }
}
