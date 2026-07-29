package com.tradenest.productservice.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="image_table")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="image_id")
    private Integer imageId;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="pid",
            foreignKey=@ForeignKey(name="fk_image_product"))
    @JsonBackReference
    private Product product;

    @Column(name="image_url",nullable=false,length=500)
    private String imageUrl;

    @Column(name="is_primary")
    private Boolean isPrimary;

    @Column(name="uploaded_at",insertable=false,updatable=false)
    private LocalDateTime uploadedAt;

}