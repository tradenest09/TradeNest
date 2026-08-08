package com.tradenest.orderservice.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PaymentMethod {
    UPI,
    CARD,
    NETBANKING,
    CASH;

    @JsonCreator
    public static PaymentMethod forValue(String value) {
        if ("TradeNest Secure".equalsIgnoreCase(value)) {
            return CARD;
        }
        for (PaymentMethod method : values()) {
            if (method.name().equalsIgnoreCase(value)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Invalid payment method: " + value);
    }
}
