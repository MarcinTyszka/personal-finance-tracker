package main.java.com.finance.backend.service;

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
}
