import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction';

/*
 * Dashboard component logic.
 * Fetches data from the backend and manually triggers change detection to update the UI.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  
  transactions: Transaction[] = [];
  balance: number = 0;
  
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      }
    });

    this.transactionService.getBalance().subscribe({
      next: (data) => {
        this.balance = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching balance:', err);
      }
    });
  }
}