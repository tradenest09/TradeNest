package com.tradenest.productservice.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tradenest.productservice.enums.ProductStatus;
import com.tradenest.productservice.enums.ProductType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="pid")
    private Integer pid;

    @Column(name="uid")
    private Integer uid;

    @ManyToOne
    @JoinColumn(name = "cid")
    private Category category;

    @Column(name="pname")
    private String pname;

    @Column(name="pdesc")
    private String pdesc;

    @Column(name="price")
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Enumerated(EnumType.STRING)
    private ProductType type;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}