import { Component, Input, SimpleChanges} from '@angular/core';
import { EMPTY_USER, User } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { UserGradeResults } from 'src/app/types/results';

@Component({
  selector: 'app-grade-grades',
  templateUrl: './grade-grades.component.html',
  styleUrls: ['./grade-grades.component.scss']
})
export class GradeGradesComponent {

  @Input() users: Map<string, User> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();

  histogramValues: number[] = [];
  selectedUser: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.userResults = changes['userResults'].currentValue;
    this.histogramValues = this.getUserHistogramValues();   // Init values
  }

  constructor(private auth: AuthService) {
    this.selectedUser = auth.uid;
  }

  getSelectedUser(): User {
    return this.users.get(this.selectedUser) || EMPTY_USER;
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  getUserHistogramValues(): number[] {
    const userResult = this.userResults.get(this.selectedUser);
    if (isNil(userResult)) return [];
    return Array.from(userResult.data.values.values());
  }

  newSelection(): void  {
    this.histogramValues = this.getUserHistogramValues();
  }
}
