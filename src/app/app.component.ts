import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

interface Person {
  firstName: string;
  lastName: string;
  gender: 'F' | 'M' | 'U';
  score: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  people: Person[] = [];
  form!: FormGroup;
  editingIndex: number | null = null;
  dataSource = new MatTableDataSource<Person>();
  displayedColumns: string[] = ['no', 'firstName', 'lastName', 'gender', 'score', 'edit'];

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      score: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    const saved = localStorage.getItem('people');
    this.people = saved ? JSON.parse(saved) : [
      { firstName: 'Wilbur', lastName: 'Rogers', gender: 'M', score: 80 },
      { firstName: 'Pearl', lastName: 'Johnson', gender: 'F', score: 60.45 },
      { firstName: 'Jane', lastName: 'Doe', gender: 'M', score: 75.5 },
      { firstName: 'John', lastName: 'Smith', gender: 'U', score: 88.2 },
    ];
    this.dataSource.data = [...this.people];
  }

  submitForm() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const newPerson: Person = {
    firstName: this.form.value.firstName,
    lastName: this.form.value.lastName,
    gender: this.form.value.gender,
    score: Number(this.form.value.score.toFixed(2))
  };

  if (this.editingIndex !== null) {
    this.people.splice(this.editingIndex, 1, newPerson);
  } else {
    this.people.push(newPerson);
  }

  this.dataSource.data = [...this.people];
  localStorage.setItem('people', JSON.stringify(this.people));
  this.resetForm();
  }

  editPerson(index: number) {
    this.editingIndex = index;
    this.form.setValue({ ...this.people[index] });
  }

  resetForm() {
    this.form.reset();
    this.editingIndex = null;
  }

  getGenderTooltip(gender: string): string {
    switch (gender) {
      case 'F': return 'Female';
      case 'M': return 'Male';
      case 'U': return 'Unknown';
      default: return '';
    }
  }

  getRequiredMessage(field: string): string {
  return `${field} is required.`;
  }
}
