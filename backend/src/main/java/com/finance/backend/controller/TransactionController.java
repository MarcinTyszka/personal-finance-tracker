package com.finance.backend.controller;

import com.finance.backend.model.Transaction;
import com.finance.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    private final TransactionService service;

    @Autowired
    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return service.getAllTransactions();
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        return service.addTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        service.deleteTransaction(id);
    }

    @GetMapping("/balance")
    public BigDecimal getBalance() {
        return service.calculateBalance();
    }

    @PutMapping("/{id}")
    public Transaction updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction) {
        return service.updateTransaction(id, transaction);
    }
}
