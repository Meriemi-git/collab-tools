import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AttributeFilter,
  FilterMetadata,
  PageEvent,
  PageOptions,
  UserDto,
  UserRole,
} from '@collab-tools/datamodel';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'collab-tools-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  @Input() users: UserDto[];
  @Input() totalRecords: number;
  @Input() rows: number;
  @Output() userUpdated = new EventEmitter<UserDto>();
  @Output() userDeleted = new EventEmitter<UserDto>();
  @Output() userFiltered = new EventEmitter<{
    userFilter: AttributeFilter;
    pageOptions: PageOptions;
  }>();

  private userFilter: AttributeFilter;
  private pageOptions: PageOptions;
  public updatingUser: UserDto;

  public displayedColumns: string[] = [
    'username',
    'mail',
    'role',
    'cguAgreementDate',
    'confirmed',
    'select',
  ];

  public roles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.DONATOR,
    UserRole.REGULAR,
    UserRole.TESTER,
  ];

  ngOnInit(): void {
    this.userFilter = {
      filters: [],
      order: 'asc',
      sortedBy: 'username',
    };
    this.pageOptions = {
      limit: this.rows,
      page: 1,
    };
  }

  public onRoleUpdate(userDto: UserDto, role: UserRole) {
    const copy = Object.assign({}, userDto);
    copy.role = role;
    this.updatingUser = copy;
  }

  public onConfirmationUpdated(userDto: UserDto, confirmed: boolean) {
    const copy = Object.assign({}, userDto);
    copy.confirmed = confirmed;
    this.updatingUser = copy;
  }

  public loadUsers(event: LazyLoadEvent) {
    this.userFilter = {
      sortedBy: event.sortField ?? 'username',
      order: event.sortOrder === 1 ? 'asc' : 'desc',
      filters: Object.keys(event.filters)
        .filter((filterkey) => event.filters[filterkey].value !== null)
        .map(
          (filterkey) =>
            ({
              attributeName: filterkey,
              operator: event.filters[filterkey].matchMode,
              value: event.filters[filterkey].value,
            } as FilterMetadata)
        ),
    };

    this.userFiltered.emit({
      userFilter: this.userFilter,
      pageOptions: this.pageOptions,
    });
  }

  public paginate(pageEvent: PageEvent) {
    this.rows = pageEvent.rows;
    this.pageOptions = {
      limit: pageEvent.rows,
      page: pageEvent.page + 1,
    };
    this.userFiltered.emit({
      userFilter: this.userFilter,
      pageOptions: this.pageOptions,
    });
  }

  public onDeleteUser(user: UserDto) {
    this.userDeleted.emit(user);
  }

  public onUpdateUser() {
    this.userUpdated.emit(this.updatingUser);
    this.updatingUser = null;
  }
}
