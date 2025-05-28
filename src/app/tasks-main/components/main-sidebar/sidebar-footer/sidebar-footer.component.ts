import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PopConfirmMessageComponent } from '../../../../shared/components/pop-confirm-message/pop-confirm-message.component';

@Component({
  selector: 'sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  standalone: true,
  imports: [PanelMenu, ButtonModule, PopConfirmMessageComponent],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarFooterComponent implements OnInit {
  items: MenuItem[] = [];

   @ViewChild(PopConfirmMessageComponent) childConfirm:
    | PopConfirmMessageComponent
    | undefined;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.signOut();
        },
      },
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        command: () => {
          this.router.navigate(['main/calendar']);
        },
      },
    ];
  }
  

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Signs out the user.
   * Adds a message to the message service of 'Signed out'.
   * Resets the current client to an empty client
   * and saves it to local storage.
   * Navigates to the home page.
   */
  signOut() {
    localStorage.removeItem('token');
    this.childConfirm?.showConfirm("User logged out");
    this.router.navigate(['']);
  }
}
