import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PixDialogComponent } from '../pix-dialog/pix-dialog.component';
import { ProductDetailsDTO } from './product-card';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'lp-product-card',
  standalone: true,
  imports: [MatButtonModule, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  readonly dialog = inject(MatDialog);

  @Input()
  produto: ProductDetailsDTO = {
    marca: "",
    nome: "",
    preco: 0,
    linkImg: ""
  };

  openPixDialog() {
    const dialogRef = this.dialog.open(PixDialogComponent, {
      data: this.produto
    });

    dialogRef.afterClosed().subscribe();
  }
}
