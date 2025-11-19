package com.hms.app.controller;

import com.hms.app.entity.Billing;
import com.hms.app.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    @Autowired
    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @PostMapping
    public ResponseEntity<Billing> createBill(@RequestBody Billing billing) {
        Billing savedBill = billingService.saveBill(billing);
        return new ResponseEntity<>(savedBill, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Billing>> getAllBills() {
        List<Billing> bills = billingService.getAllBills();
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Billing> getBillById(@PathVariable Long id) {
        Optional<Billing> billOptional = billingService.getBillById(id);
        return billOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Billing> updateBill(@PathVariable Long id, @RequestBody Billing billDetails) {
        Optional<Billing> billOptional = billingService.getBillById(id);

        if (!billOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Billing existingBill = billOptional.get();

        existingBill.setPatient(billDetails.getPatient());

        existingBill.setStatus(billDetails.getStatus());

        Billing updatedBill = billingService.saveBill(existingBill);
        return ResponseEntity.ok(updatedBill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        if (!billingService.getBillById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        billingService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }
}
