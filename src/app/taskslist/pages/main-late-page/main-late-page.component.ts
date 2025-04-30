import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from '../../components/page-template/page-template.component';

@Component({
  selector: 'main-late-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-late-page.component.html',
  styleUrl: './main-late-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainLatePageComponent {
  pageTitle = signal<string>('Late');
}
