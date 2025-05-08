import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthService } from '../../../../auth/services/auth.service';
import { Client } from '../../../../interfaces/Client';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
  selector: 'sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  standalone: true,
  imports: [PanelMenu, ToastModule, ButtonModule],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarFooterComponent implements OnInit {
  items: MenuItem[] = [];
  localService = inject(LocalStorageService);
  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Signed out',
            detail: 'User logged out',
            life: 3000,
          });
          const emptyClient: Client = {
            username: '',
            password: '',
            tags: [],
            tasks: [],
            categories: [],
          };
          /*
          const emptyClient : ClientDB = {
            username: '',
            password: '',
            client_name: ''
          }

          this.store
            .dispatch(new changeClient({ currentUser: emptyClient }))
            .subscribe();
            */
          this.localService.setCurrentClient(emptyClient);
          this.router.navigate(['']);
        },
      },
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        command: () => {
          this.router.navigate(['main/calendar']);
        }
      },
    ];
  }
}
