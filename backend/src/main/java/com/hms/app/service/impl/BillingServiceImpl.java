package com.hms.app.service.impl;

import com.hms.app.entity.Billing;
import com.hms.app.repository.BillingRepository;
import com.hms.app.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingServiceImpl implements BillingService {

    private final BillingRepository billingRepository;

    @Autowired
    public BillingServiceImpl(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @Override
    public Billing saveBill(Billing billing) {
        return billingRepository.save(billing);
    }

    @Override
    public List<Billing> getAllBills() {
        return billingRepository.findAll();
    }

    @Override
    public Optional<Billing> getBillById(Long id) {
        return billingRepository.findById(id);
    }

    @Override
    public void deleteBill(Long id) {
        billingRepository.deleteById(id);
    }
}
