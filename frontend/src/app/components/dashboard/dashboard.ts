import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

/*
 * DashboardComponent handles the main logic for financial overview,
 * including CRUD operations and data visualization using Chart.js.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  // --- Application State ---
  transactions: Transaction[] = [];
  balance: number = 0;
  transactionForm: FormGroup;
  isEditMode: boolean = false;
  currentEditId: number | undefined;
  currentFilter: string = '';
  timeViewMode: 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  // --- Services ---
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  // --- Pie Charts Configuration ---
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public incomePieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  // --- Bar Chart Configuration ---
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Income', backgroundColor: '#66BB6A' },
      { data: [], label: 'Expenses', backgroundColor: '#EF5350' }
    ]
  };

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

  // --- Data Loading & Processing ---

  /* Fetches all data from services and triggers chart updates */
  private loadData(): void {
    this.transactionService.getTransactions(this.currentFilter).subscribe({
      next: (data) => {
        this.transactions = data;
        this.preparePieChartData();
        this.prepareBarChartData();
        this.cdr.detectChanges();
      }
    });

    this.transactionService.getBalance().subscribe({
      next: (data) => {
        this.balance = data;
        this.cdr.detectChanges();
      }
    });
  }

  /* Groups data by category for Pie Charts */
  private preparePieChartData(): void {
    const expenseData = this.transactions.filter(t => t.type === 'EXPENSE');
    const expenseMap = new Map<string, number>();
    expenseData.forEach(t => {
      expenseMap.set(t.category, (expenseMap.get(t.category) || 0) + t.amount);
    });

    this.pieChartData = {
      labels: Array.from(expenseMap.keys()),
      datasets: [{ data: Array.from(expenseMap.values()) }]
    };

    const incomeData = this.transactions.filter(t => t.type === 'INCOME');
    const incomeMap = new Map<string, number>();
    incomeData.forEach(t => {
      incomeMap.set(t.category, (incomeMap.get(t.category) || 0) + t.amount);
    });

    this.incomePieChartData = {
      labels: Array.from(incomeMap.keys()),
      datasets: [{ 
        data: Array.from(incomeMap.values()),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA']
      }]
    };
  }

  /* Groups data by time periods for the Bar Chart */
  private prepareBarChartData(): void {
    const groupedData = new Map<string, { income: number, expense: number }>();

    this.transactions.forEach(t => {
      const date = new Date(t.date);
      let periodKey = '';

      if (this.timeViewMode === 'monthly') {
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (this.timeViewMode === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        periodKey = `${date.getFullYear()} Q${quarter}`;
      } else {
        periodKey = `${date.getFullYear()}`;
      }

      const current = groupedData.get(periodKey) || { income: 0, expense: 0 };
      if (t.type === 'INCOME') current.income += t.amount;
      else current.expense += t.amount;
      
      groupedData.set(periodKey, current);
    });

    const sortedKeys = Array.from(groupedData.keys()).sort();

    this.barChartData = {
      labels: sortedKeys,
      datasets: [
        { data: sortedKeys.map(key => groupedData.get(key)!.income), label: 'Income', backgroundColor: '#66BB6A' },
        { data: sortedKeys.map(key => groupedData.get(key)!.expense), label: 'Expenses', backgroundColor: '#EF5350' }
      ]
    };
  }

  // --- User Interactions ---

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData: Transaction = this.transactionForm.value;
      const request = (this.isEditMode && this.currentEditId) 
        ? this.transactionService.updateTransaction(this.currentEditId, formData)
        : this.transactionService.addTransaction(formData);

      request.subscribe({
        next: () => {
          this.loadData();
          this.cancelEdit();
        }
      });
    }
  }

  editTransaction(transaction: Transaction): void {
    this.isEditMode = true;
    this.currentEditId = transaction.id;
    this.transactionForm.patchValue(transaction);
  }

  deleteTransaction(id: number | undefined): void {
    if (!id) return;
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => this.loadData()
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.currentEditId = undefined;
    this.transactionForm.reset({ type: 'EXPENSE' });
  }

  setFilter(type: string): void {
    this.currentFilter = type;
    this.loadData();
  }

  setTimeViewMode(mode: 'monthly' | 'quarterly' | 'yearly'): void {
    this.timeViewMode = mode;
    this.prepareBarChartData();
    this.cdr.detectChanges();
  }
}