import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from "../../components/page-template/page-template.component";

@Component({
  selector: 'main-nonstarted-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-nonstarted-page.component.html',
  styleUrl: './main-nonstarted-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainNonstartedPageComponent {
  pageTitle = signal<string>('Non Started');
}