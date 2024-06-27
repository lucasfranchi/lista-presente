import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductDetailsDTO } from './components/product-card/product-card';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ProductCardComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'lista-presentes';

    listaPresentes: Array<ProductDetailsDTO> = [
        {
            nome: "Cafeteira",
            marca: "Dolce Gusto",
            preco: 0.01,
            linkImg: "https://m.media-amazon.com/images/I/6134QEHSW4L._AC_SX679_.jpg"
        },
        {
            nome: "Cooktop",
            marca: "Eletrolux",
            preco: 123.98,
            linkImg: "https://electrolux.vtexassets.com/arquivos/ids/205848-1200-1200?v=637477850049400000&width=1200&height=1200&aspect=true"
        },
    ]
}
