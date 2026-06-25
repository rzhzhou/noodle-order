package com.noodle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalOrders;
    private long totalProducts;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private List<UnitOrderStat> unitStats;
    private List<CategorySalesStat> categoryStats;

    @Data
    @AllArgsConstructor
    public static class UnitOrderStat {
        private String unit;
        private long orderCount;
        private BigDecimal totalAmount;
    }

    @Data
    @AllArgsConstructor
    public static class CategorySalesStat {
        private String category;
        private long quantity;
        private BigDecimal amount;
    }
}