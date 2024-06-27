import { Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-pix',
  standalone: true,
  imports: [],
  templateUrl: './snackbar-pix.component.html',
  styleUrl: './snackbar-pix.component.scss'
})
export class SnackbarPixComponent {
  snackBarRef = inject(MatSnackBarRef);
}
