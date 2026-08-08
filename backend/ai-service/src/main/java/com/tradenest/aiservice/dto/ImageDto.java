package com.tradenest.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageDto {
    private Integer imageId;
    private Integer pid;
    private String imageUrl;
    private boolean isPrimary;
}
