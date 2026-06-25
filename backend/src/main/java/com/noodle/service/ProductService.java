package com.noodle.service;

import com.noodle.model.Product;
import com.noodle.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllAvailableProducts() {
        return productRepository.findByAvailableTrueOrderBySortOrderAsc();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndAvailableTrueOrderBySortOrderAsc(category);
    }

    public List<String> getCategories() {
        return productRepository.findDistinctCategoryBy();
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商品不存在: " + id));
    }
}