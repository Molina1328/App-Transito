import { Component, OnInit,OnDestroy} from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-floating-tab',
  templateUrl: './floating-tab.component.html',
  styleUrls: ['./floating-tab.component.scss'],
})
export class FloatingTabComponent implements OnInit, OnDestroy {
  isVisible = false;
  currentMessage = '';
  private messageSubscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.messageSubscription = this.notificationService.message$.subscribe((message) => {
      this.currentMessage = message;
      this.showTab();
    });
  }

  showTab() {
    this.isVisible = true;
    setTimeout(() => this.isVisible = false, 5000); // Ocultar después de 5 segundos
  }

  hideTab() {
    this.isVisible = false;
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}