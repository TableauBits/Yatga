import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeElectoralComponent } from './grade-electoral.component';

describe('GradeElectoralComponent', () => {
  let component: GradeElectoralComponent;
  let fixture: ComponentFixture<GradeElectoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeElectoralComponent ],
      schemas: []
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeElectoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should merge voters with the same guess', () => {
    component.users = new Map([
      ['u1', { uid: 'u1', displayName: 'Alice', photoURL: '', description: '' }],
      ['u2', { uid: 'u2', displayName: 'Bob', photoURL: '', description: '' }],
      ['u3', { uid: 'u3', displayName: 'Charlie', photoURL: '', description: '' }],
    ] as any);
    component.currentSong = { id: 42, user: 'u1' } as any;
    component.userGuesses = new Map([
      ['u2', { uid: 'u2', guesses: new Map([[42, 'u3']]) }],
      ['u3', { uid: 'u3', guesses: new Map([[42, 'u3']]) }],
    ] as any);

    const rows = component.getGuessRows();

    expect(rows.length).toBe(2);
    expect(rows[0].guessUser.uid).toBe('u1');
    expect(rows[0].voters).toEqual([]);
    expect(rows[1].guessUser.uid).toBe('u3');
    expect(rows[1].voters.map((user) => user.uid)).toEqual(['u2', 'u3']);
  });
});
