package com.tradenest.productservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tradenest.productservice.entities.Report;

public interface ReportRepository extends JpaRepository<Report, Integer> {
}
