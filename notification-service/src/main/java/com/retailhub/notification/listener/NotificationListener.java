package com.retailhub.notification.listener;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    /**
     * OBSERVER PATTERN:
     * This method 'observes' the 'notification-topic' and reacts whenever a message
     * arrives.
     */
    @KafkaListener(topics = "notification-topic", groupId = "notification_group")
    public void listen(String message) {
        // In a real system, this would send an email or SMS/Push Notification
        System.out.println("📨 NOTIFICATION SERVICE RECEIVED: " + message);
        System.out.println("Processing email delivery...");
    }
}
