import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from "../../components/page-template/page-template.component";

@Component({
  selector: 'main-finished-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-finished-page.component.html',
  styleUrl: './main-finished-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainFinishedPageComponent {
  pageTitle = signal<string>('Finished');
 }
