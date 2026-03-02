import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction';

/*
 * Dashboard component logic handling full CRUD operations.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  
  transactions: Transaction[] = [];
  balance: number = 0;
  
  transactionForm: FormGroup;
  isEditMode: boolean = false;
  currentEditId: number | undefined;
  
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.transactionForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
      type: new FormControl('EXPENSE', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl(''),
      date: new FormControl('', Validators.required)
    });
  }

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

  deleteTransaction(id: number | undefined): void {
    if (!id) return;

    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting transaction:', err);
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    this.isEditMode = true;
    this.currentEditId = transaction.id;
    
    this.transactionForm.patchValue({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.currentEditId = undefined;
    this.transactionForm.reset({ type: 'EXPENSE' });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData: Transaction = this.transactionForm.value;
      
      if (this.isEditMode && this.currentEditId) {
        this.transactionService.updateTransaction(this.currentEditId, formData).subscribe({
          next: () => {
            this.loadData();
            this.cancelEdit();
          },
          error: (err) => {
            console.error('Error updating transaction:', err);
          }
        });
      } else {
        this.transactionService.addTransaction(formData).subscribe({
          next: () => {
            this.loadData();
            this.transactionForm.reset({ type: 'EXPENSE' });
          },
          error: (err) => {
            console.error('Error adding transaction:', err);
          }
        });
      }
    }
  }
}