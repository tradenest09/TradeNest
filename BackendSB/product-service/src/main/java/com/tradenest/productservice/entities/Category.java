package com.tradenest.productservice.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cid")
    private Integer cid;

    @Column(name="cname",nullable=false,unique=true,length=100)
    private String cname;

    @Column(name="description",length=300)
    private String description;

    @OneToMany(mappedBy="category",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            fetch = FetchType.LAZY)
    
    private List<Product> products = new ArrayList<>();

}