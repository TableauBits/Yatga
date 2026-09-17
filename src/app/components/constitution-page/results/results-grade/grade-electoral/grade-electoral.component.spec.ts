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

  it('should filter rows to a selected user predictions', () => {
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
    component.selectedUser = 'u2';

    const rows = component.getGuessRows();

    expect(rows.length).toBe(1);
    expect(rows[0].guessUser.uid).toBe('u3');
    expect(rows[0].voters.map((user) => user.uid)).toEqual(['u2', 'u3']);
  });

  it('should aggregate guesses in the confusion matrix', () => {
    component.users = new Map([
      ['u1', { uid: 'u1', displayName: 'Alice', photoURL: '', description: '' }],
      ['u2', { uid: 'u2', displayName: 'Bob', photoURL: '', description: '' }],
    ] as any);
    component.songs = new Map([
      [1, { id: 1, user: 'u1' }],
      [2, { id: 2, user: 'u1' }],
      [3, { id: 3, user: 'u2' }],
    ] as any);
    component.userGuesses = new Map([
      ['u1', { uid: 'u1', guesses: new Map([[3, 'u2']]) }],
      ['u2', { uid: 'u2', guesses: new Map([[1, 'u1'], [2, 'u2']]) }],
    ] as any);

    const rows = component.getConfusionMatrixRows();
    const aliceRow = rows.find((row) => row.actualUser.uid === 'u1')!;
    const bobRow = rows.find((row) => row.actualUser.uid === 'u2')!;

    expect(component.getConfusionMatrixValue(aliceRow, component.users.get('u1')!)).toBe(1);
    expect(component.getConfusionMatrixValue(aliceRow, component.users.get('u2')!)).toBe(1);
    expect(aliceRow.total).toBe(2);
    expect(component.getConfusionMatrixValue(bobRow, component.users.get('u2')!)).toBe(1);
    expect(bobRow.total).toBe(1);
  });
});
