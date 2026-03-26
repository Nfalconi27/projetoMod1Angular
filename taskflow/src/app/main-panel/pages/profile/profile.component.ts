import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatList, MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-profile',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatNavList],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
