package com.noodle.service;

import com.noodle.dto.OrderRequest;
import com.noodle.model.Order;
import com.noodle.model.OrderItem;
import com.noodle.model.Product;
import com.noodle.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductService productService;

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .userUnit(request.getUserUnit())
                .note(request.getNote())
                .status("pending")
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getProduct(itemReq.getProductId());

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(itemReq.getQuantity())
                    .subtotal(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())))
                    .build();

            order.getItems().add(item);
            total = total.add(item.getSubtotal());
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在: " + id));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findByStatusOrderByCreatedAtDesc("pending");
    }
}