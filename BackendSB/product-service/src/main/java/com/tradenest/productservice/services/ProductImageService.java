package com.tradenest.productservice.services;

import java.util.List;

import com.tradenest.productservice.dto.request.AddImageRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ImageResponse;

public interface ProductImageService {

    ImageResponse addImage(AddImageRequest request);

    List<ImageResponse> getImagesByProduct(Integer pid);

    ApiResponse deleteImage(Integer piid);

}