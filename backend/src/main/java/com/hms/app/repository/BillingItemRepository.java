package com.hms.app.repository;

import com.hms.app.entity.BillingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingItemRepository extends JpaRepository<BillingItem, Long> {

}

