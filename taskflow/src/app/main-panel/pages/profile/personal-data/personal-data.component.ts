import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-personal-data',
  imports: [MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.css'
})
export class PersonalDataComponent {

  user = {
    name: 'Mariana',
    email: 'mariana@nf.com',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999'
  };
}

