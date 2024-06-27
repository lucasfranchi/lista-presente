import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QRCodeModule } from 'angularx-qrcode';
import { SnackbarPixComponent } from '../snackbar-pix/snackbar-pix.component';
import { ProductDetailsDTO } from '../product-card/product-card';

@Component({
  selector: 'app-pix-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, QRCodeModule],
  templateUrl: './pix-dialog.component.html',
  styleUrl: './pix-dialog.component.scss'
})
export class PixDialogComponent {
  payload = "";
  valor
  produto: ProductDetailsDTO
  pixKey = "46012178816";
  description = "Cafeteira Dolce Gusto";
  merchantName = "Lucas Sousa Franchi";
  merchantCity = "SAO PAULO";
  txid = "90006224052";
  amount

  ID_PAYLOAD_FORMAT_INDICATOR = "00";
  ID_MERCHANT_ACCOUNT_INFORMATION = "26";
  ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
  ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
  ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
  ID_MERCHANT_CATEGORY_CODE = "52";
  ID_TRANSACTION_CURRENCY = "53";
  ID_TRANSACTION_AMOUNT = "54";
  ID_COUNTRY_CODE = "58";
  ID_MERCHANT_NAME = "59";
  ID_MERCHANT_CITY = "60";
  ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
  ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
  ID_CRC16 = "63";

  durationInSeconds = 5;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductDetailsDTO, private _snackBar: MatSnackBar) {
    this.produto = data;
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarPixComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  ngOnInit(): void {
    this.payload = this.getPayload();
  }

  public getPayload() {
    this.valor = this.produto.preco;
    this.description = this.produto.nome + " - " + this.produto.marca;
    this.amount = this.produto.preco.toFixed(2);
    
    const payload =
      this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR, "01") +
      this._getMechantAccountInfo() +
      this._getValue(this.ID_MERCHANT_CATEGORY_CODE, "0000") +
      this._getValue(this.ID_TRANSACTION_CURRENCY, "986") +
      this._getValue(this.ID_TRANSACTION_AMOUNT, this.amount) +
      this._getValue(this.ID_COUNTRY_CODE, "BR") +
      this._getValue(this.ID_MERCHANT_NAME, this.merchantName) +
      this._getValue(this.ID_MERCHANT_CITY, this.merchantCity) +
      this._getAdditionalDataFieldTemplate();

    return payload + this._getCRC16(payload);
  }

  public copyPix() {
    navigator.clipboard.writeText(this.payload);
    this.openSnackBar();
  }

  private _getValue(id, value) {
    const size = String(value.length).padStart(2, "0");
    return id + size + value;
  }

  private _getMechantAccountInfo() {
    const gui = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI,
      "br.gov.bcb.pix"
    );
    const key = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY,
      this.pixKey
    );
    const description = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION,
      this.description
    );

    return this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION,
      gui + key + description
    );
  }

  private _getAdditionalDataFieldTemplate() {
    const txid = this._getValue(
      this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,
      this.txid
    );
    return this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
  }

  private _getCRC16(payload) {
    function ord(str) {
      return str.charCodeAt(0);
    }
    function dechex(number) {
      if (number < 0) {
        number = 0xffffffff + number + 1;
      }
      return parseInt(number, 10).toString(16);
    }

    payload = payload + this.ID_CRC16 + "04";

    let polinomio = 0x1021;
    let resultado = 0xffff;
    let length;

    if ((length = payload.length) > 0) {
      for (let offset = 0; offset < length; offset++) {
        resultado ^= ord(payload[offset]) << 8;
        for (let bitwise = 0; bitwise < 8; bitwise++) {
          if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
          resultado &= 0xffff;
        }
      }
    }

    return this.ID_CRC16 + "04" + dechex(resultado).toUpperCase();
  }

}
