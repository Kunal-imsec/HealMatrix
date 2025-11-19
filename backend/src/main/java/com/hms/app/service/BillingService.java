package com.hms.app.service;

import com.hms.app.entity.Billing;
import java.util.List;
import java.util.Optional;


public interface BillingService {

    Billing saveBill(Billing billing);

    List<Billing> getAllBills();


    Optional<Billing> getBillById(Long id);

    void deleteBill(Long id);
}
