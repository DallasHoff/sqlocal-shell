import { Component } from '@angular/core';

@Component({
  selector: 'shell-header',
  imports: [],
  templateUrl: './shell-header.component.html',
  styleUrl: './shell-header.component.scss',
})
export class ShellHeaderComponent {
  homeUrl = 'https://sqlocal.dallashoffman.com/';

  links: { label: string; icon: string; href: string }[] = [
    {
      label: 'GitHub',
      icon: 'github.svg',
      href: 'https://github.com/DallasHoff/sqlocal',
    },
    {
      label: 'NPM',
      icon: 'npm.svg',
      href: 'https://www.npmjs.com/package/sqlocal',
    },
    {
      label: 'Fund',
      icon: 'heart.svg',
      href: 'https://www.paypal.com/biz/fund?id=U3ZNM2Q26WJY8',
    },
  ];
}
