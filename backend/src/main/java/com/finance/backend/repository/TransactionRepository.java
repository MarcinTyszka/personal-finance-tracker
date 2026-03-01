package main.java.com.finance.backend.repository;

import com.finance.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public class TransactionRepository extends JpaRepository<Transaction, Long> {
    
}
