package com.noodle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "商品名称不能为空")
    private String name;

    @NotBlank(message = "分类不能为空")
    private String category;

    @NotNull(message = "价格不能为空")
    private BigDecimal price;

    private String unit;
    private String description;
    private Boolean available;
    private Integer sortOrder;
    private Integer maxPerOrder;
}