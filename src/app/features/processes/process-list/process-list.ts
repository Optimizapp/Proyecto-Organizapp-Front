import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProcessService } from '../process.service';
import { Process } from '../models/process.model';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css'
})
export class ProcessList implements OnInit {
  processes: Process[] = [];
  filteredProcesses: Process[] = [];

  nameFilter = '';
  statusFilter = '';

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.processService.getProcesses().subscribe(data => {
      this.processes = data;
      this.filteredProcesses = data;
    });
  }

  applyFilters(): void {
    const name = this.nameFilter.toLowerCase().trim();
    const status = this.statusFilter.toLowerCase().trim();

    this.filteredProcesses = this.processes.filter(process => {
      const matchesName =
        !name || process.name.toLowerCase().includes(name);

      const matchesStatus =
        !status || process.status?.toLowerCase() === status;

      return matchesName && matchesStatus;
    });
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.statusFilter = '';
    this.filteredProcesses = this.processes;
  }
}