import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProcessService } from '../process.service';
import { Process } from '../models/process.model';

@Component({
  selector: 'app-process-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './process-detail.html',
  styleUrl: './process-detail.css'
})
export class ProcessDetail implements OnInit {
  process?: Process;

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.processService.getProcessById(id).subscribe(data => {
      this.process = data;
    });
  }
}