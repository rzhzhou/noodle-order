package com.noodle.service;

import com.noodle.dto.DashboardStats;
import com.noodle.dto.ProductRequest;
import com.noodle.model.Order;
import com.noodle.model.OrderItem;
import com.noodle.model.Product;
import com.noodle.repository.OrderRepository;
import com.noodle.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    // === Product Management ===
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(ProductRequest req) {
        Product product = Product.builder()
                .name(req.getName())
                .category(req.getCategory())
                .price(req.getPrice())
                .unit(req.getUnit() != null ? req.getUnit() : "份")
                .description(req.getDescription())
                .available(req.getAvailable() != null ? req.getAvailable() : true)
                .sortOrder(req.getSortOrder())
                .maxPerOrder(req.getMaxPerOrder() != null ? req.getMaxPerOrder() : 99)
                .build();
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商品不存在: " + id));
        product.setName(req.getName());
        product.setCategory(req.getCategory());
        product.setPrice(req.getPrice());
        if (req.getUnit() != null) product.setUnit(req.getUnit());
        product.setDescription(req.getDescription());
        if (req.getAvailable() != null) product.setAvailable(req.getAvailable());
        if (req.getSortOrder() != null) product.setSortOrder(req.getSortOrder());
        if (req.getMaxPerOrder() != null) product.setMaxPerOrder(req.getMaxPerOrder());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // === Order Management ===
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // === Dashboard ===
    public DashboardStats getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();

        long totalOrders = allOrders.size();
        long pendingOrders = allOrders.stream().filter(o -> "pending".equals(o.getStatus())).count();
        BigDecimal totalRevenue = allOrders.stream()
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalProducts = productRepository.count();

        // Stats by unit
        Map<String, List<Order>> byUnit = allOrders.stream()
                .collect(Collectors.groupingBy(Order::getUserUnit));
        List<DashboardStats.UnitOrderStat> unitStats = byUnit.entrySet().stream()
                .map(e -> {
                    BigDecimal amt = e.getValue().stream()
                            .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new DashboardStats.UnitOrderStat(e.getKey(), e.getValue().size(), amt);
                })
                .collect(Collectors.toList());

        // Stats by category (from order items)
        Map<String, List<OrderItem>> byCategory = new HashMap<>();
        for (Order order : allOrders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    // Get category from product
                    productRepository.findById(item.getProductId()).ifPresent(prod -> {
                        byCategory.computeIfAbsent(prod.getCategory(), k -> new ArrayList<>()).add(item);
                    });
                }
            }
        }
        List<DashboardStats.CategorySalesStat> categoryStats = byCategory.entrySet().stream()
                .map(e -> {
                    long qty = e.getValue().stream().mapToLong(OrderItem::getQuantity).sum();
                    BigDecimal amt = e.getValue().stream()
                            .map(i -> i.getSubtotal() != null ? i.getSubtotal() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new DashboardStats.CategorySalesStat(e.getKey(), qty, amt);
                })
                .collect(Collectors.toList());

        return new DashboardStats(totalOrders, totalProducts, totalRevenue, pendingOrders, unitStats, categoryStats);
    }
}