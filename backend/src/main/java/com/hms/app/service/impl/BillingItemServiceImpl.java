package com.hms.app.service.impl;

import com.hms.app.entity.BillingItem;
import com.hms.app.repository.BillingItemRepository;
import com.hms.app.service.BillingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class BillingItemServiceImpl implements BillingItemService {

    private final BillingItemRepository billingItemRepository;

    @Autowired
    public BillingItemServiceImpl(BillingItemRepository billingItemRepository) {
        this.billingItemRepository = billingItemRepository;
    }

    @Override
    public BillingItem saveBillingItem(BillingItem billingItem) {
        return billingItemRepository.save(billingItem);
    }

    @Override
    public List<BillingItem> getAllBillingItems() {
        return billingItemRepository.findAll();
    }

    @Override
    public Optional<BillingItem> getBillingItemById(Long id) {
        return billingItemRepository.findById(id);
    }

    @Override
    public void deleteBillingItem(Long id) {
        billingItemRepository.deleteById(id);
    }
}
