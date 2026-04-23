import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProcessService } from '../process.service';
import { Process } from '../models/process.model';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css'
})
export class ProcessList implements OnInit {
  processes: Process[] = [];

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.processService.getProcesses().subscribe(data => {
      this.processes = data;
    });
  }
}