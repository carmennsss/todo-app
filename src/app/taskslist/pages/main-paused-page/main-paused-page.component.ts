import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from "../../components/page-template/page-template.component";

@Component({
  selector: 'main-paused-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-paused-page.component.html',
  styleUrl: './main-paused-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainPausedPageComponent { 
  pageTitle = signal<string>('Paused');
}
