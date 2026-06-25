package com.noodle.controller;

import com.noodle.dto.*;
import com.noodle.model.Order;
import com.noodle.model.Product;
import com.noodle.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    // === Dashboard ===
    @GetMapping("/dashboard")
    public ApiResponse<DashboardStats> getDashboard() {
        return ApiResponse.success(adminService.getDashboardStats());
    }

    // === Product CRUD ===
    @GetMapping("/products")
    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.success(adminService.getAllProducts());
    }

    @PostMapping("/products")
    public ApiResponse<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(adminService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(adminService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ApiResponse.success(null);
    }

    // === Order Management ===
    @GetMapping("/orders")
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success(adminService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest request) {
        return ApiResponse.success(adminService.updateOrderStatus(id, request.getStatus()));
    }
}