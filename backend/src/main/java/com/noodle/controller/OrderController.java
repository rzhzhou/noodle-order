package com.noodle.controller;

import com.noodle.dto.ApiResponse;
import com.noodle.dto.OrderRequest;
import com.noodle.model.Order;
import com.noodle.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ApiResponse<Order> createOrder(@Valid @RequestBody OrderRequest request) {
        return ApiResponse.success(orderService.createOrder(request));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getUserOrders(@PathVariable String userId) {
        return ApiResponse.success(orderService.getUserOrders(userId));
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> getOrder(@PathVariable Long id) {
        return ApiResponse.success(orderService.getOrder(id));
    }

    @GetMapping("/all")
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success(orderService.getAllOrders());
    }
}