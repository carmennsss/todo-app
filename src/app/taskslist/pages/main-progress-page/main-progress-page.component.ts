import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from "../../components/page-template/page-template.component";

@Component({
  selector: 'main-progress-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-progress-page.component.html',
  styleUrl: './main-progress-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainProgressPageComponent {
  pageTitle = signal<string>('In Progress');
}
