package com.finance.backend.service;

import com.finance.backend.model.Transaction;
import com.finance.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
public class TransactionService {

    private final TransactionRepository repository;

    @Autowired
    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    public Transaction addTransaction(Transaction transaction){
        return repository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        repository.deleteById(id);
    }

    public Transaction updateTransaction(Long id, Transaction updatedData) {
        Transaction existing = repository.findById(id).orElse(null);
        if (existing != null) {
            existing.setAmount(updatedData.getAmount());
            existing.setType(updatedData.getType());
            existing.setCategory(updatedData.getCategory());
            existing.setDescription(updatedData.getDescription());
            existing.setDate(updatedData.getDate());
            return repository.save(existing);
        }
        return null;
    }

    public BigDecimal calculateBalance() {
        List<Transaction> transactions = repository.findAll();
        BigDecimal balance = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                balance = balance.add(t.getAmount());
            } else if ("EXPENSE".equalsIgnoreCase(t.getType())) {
                balance = balance.subtract(t.getAmount());
            }
        }

        return balance;
    }


    public List<Transaction> getTransactions(String type) {
        if (type != null && !type.trim().isEmpty()) {
            return repository.findByTypeIgnoreCase(type);
        }
        return repository.findAll();
    }
}
