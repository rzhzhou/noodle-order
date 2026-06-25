package com.noodle.config;

import com.noodle.model.Product;
import com.noodle.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        productRepository.save(Product.builder()
                .name("红烧牛肉粉").category("汤粉").price(new BigDecimal("18.00"))
                .description("浓郁牛肉汤底，大块牛肉")
                .image("/static/products/01-beef-noodles.jpg")
                .sortOrder(1).maxPerOrder(5).build());

        productRepository.save(Product.builder()
                .name("酸菜鱼粉").category("汤粉").price(new BigDecimal("16.00"))
                .description("酸爽开胃，鲜嫩鱼片")
                .image("/static/products/02-fish-noodles.jpg")
                .sortOrder(2).maxPerOrder(5).build());

        productRepository.save(Product.builder()
                .name("香菇鸡丝粉").category("汤粉").price(new BigDecimal("15.00"))
                .description("鲜香滑嫩，养生暖胃")
                .image("/static/products/03-chicken-noodles.jpg")
                .sortOrder(3).maxPerOrder(5).build());

        productRepository.save(Product.builder()
                .name("炸酱面").category("干拌").price(new BigDecimal("14.00"))
                .description("老北京炸酱，劲道面条")
                .image("/static/products/04-zhajiang-noodles.jpg")
                .sortOrder(4).maxPerOrder(5).build());

        productRepository.save(Product.builder()
                .name("葱油拌面").category("干拌").price(new BigDecimal("12.00"))
                .description("葱香四溢，简单美味")
                .image("/static/products/05-scallion-noodles.jpg")
                .sortOrder(5).maxPerOrder(5).build());

        productRepository.save(Product.builder()
                .name("热干面").category("干拌").price(new BigDecimal("13.00"))
                .description("武汉特色，芝麻酱香")
                .image("/static/products/06-hot-dry-noodles.jpg")
                .sortOrder(6).maxPerOrder(5).build());

        productRepository.save(Product.builder()
                .name("卤蛋").category("加料").price(new BigDecimal("3.00"))
                .description("秘制卤蛋，入味十足")
                .image("/static/products/07-egg.jpg")
                .sortOrder(7).maxPerOrder(10).build());

        productRepository.save(Product.builder()
                .name("豆奶").category("饮品").price(new BigDecimal("5.00"))
                .description("冰镇豆奶，清爽解渴")
                .image("/static/products/08-soy-milk.jpg")
                .sortOrder(8).maxPerOrder(10).build());

        System.out.println(">>> 初始化商品数据完成！共 " + productRepository.count() + " 个商品");
    }
}