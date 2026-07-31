package com.tradenest.productservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddImageRequest {

    private Integer pid;

    private String imageUrl;

    private Boolean isPrimary;

}