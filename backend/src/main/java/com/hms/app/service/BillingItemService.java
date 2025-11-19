package com.hms.app.service;

import com.hms.app.entity.BillingItem;
import java.util.List;
import java.util.Optional;


public interface BillingItemService {

    BillingItem saveBillingItem(BillingItem billingItem);

    List<BillingItem> getAllBillingItems();


    Optional<BillingItem> getBillingItemById(Long id);


    void deleteBillingItem(Long id);
}
