package com.tradenest.productservice.entities;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="product_rent")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRent {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="prid")
    private Integer prid;

    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="pid",
            foreignKey=@ForeignKey(name="fk_rent_product"))
    @JsonBackReference
    private Product product;

    @Column(name="no_of_days")
    private Integer noOfDays;

    @Column(name="charge_per_day")
    private BigDecimal chargePerDay;

    @Column(name="security_deposit")
    private BigDecimal securityDeposit;

}