import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { UserDto, UserRole } from '@collab-tools/datamodel';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CanAccessAdminGuard implements CanActivate {
  constructor(private readonly messageService: MessageService) {}

  public canActivate(_route: ActivatedRouteSnapshot): boolean {
    const userInfosStr = localStorage.getItem('userInfos');
    if (userInfosStr) {
      const userInfos: UserDto = JSON.parse(userInfosStr);
      if (userInfos && userInfos.role === UserRole.ADMIN) {
        return true;
      }
    }
    this.messageService.add({
      severity: 'warn',
      summary: 'Insufficient Permissions',
      detail: 'You must login to access to this page',
    });
    return false;
  }
}
