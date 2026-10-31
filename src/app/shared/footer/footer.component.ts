import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Facebook,
  Instagram,
  Twitter,
  X
} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [RouterLink,LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly Facebook = Facebook;
  readonly Instagram = Instagram;
  readonly X = X;


}
