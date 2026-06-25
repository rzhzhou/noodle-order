package com.noodle.repository;

import com.noodle.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByAvailableTrueOrderBySortOrderAsc();
    List<Product> findByCategoryAndAvailableTrueOrderBySortOrderAsc(String category);

    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findDistinctCategoryBy();
}