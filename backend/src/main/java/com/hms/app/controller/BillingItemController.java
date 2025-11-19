package com.hms.app.controller;

import com.hms.app.entity.BillingItem;
import com.hms.app.service.BillingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/billing-items")
public class BillingItemController {

    private final BillingItemService billingItemService;

    @Autowired
    public BillingItemController(BillingItemService billingItemService) {
        this.billingItemService = billingItemService;
    }

    @PostMapping
    public ResponseEntity<BillingItem> createBillingItem(@RequestBody BillingItem billingItem) {
        BillingItem savedItem = billingItemService.saveBillingItem(billingItem);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BillingItem>> getAllBillingItems() {
        List<BillingItem> items = billingItemService.getAllBillingItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillingItem> getBillingItemById(@PathVariable Long id) {
        Optional<BillingItem> itemOptional = billingItemService.getBillingItemById(id);
        return itemOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BillingItem> updateBillingItem(@PathVariable Long id, @RequestBody BillingItem itemDetails) {
        Optional<BillingItem> itemOptional = billingItemService.getBillingItemById(id);

        if (!itemOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        BillingItem existingItem = itemOptional.get();

        existingItem.setBilling(itemDetails.getBilling());
        existingItem.setDescription(itemDetails.getDescription());
        existingItem.setAmount(itemDetails.getAmount());

        BillingItem updatedItem = billingItemService.saveBillingItem(existingItem);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBillingItem(@PathVariable Long id) {
        if (!billingItemService.getBillingItemById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        billingItemService.deleteBillingItem(id);
        return ResponseEntity.noContent().build();
    }
}
