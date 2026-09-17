import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeGuessComponent } from './grade-guess.component';

describe('GradeGuessComponent', () => {
  let component: GradeGuessComponent;
  let fixture: ComponentFixture<GradeGuessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeGuessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeGuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should limit the matrix to the selected guesser predictions', () => {
    component.users = new Map([
      ['u1', { uid: 'u1', displayName: 'Alice', photoURL: '', description: '' }],
      ['u2', { uid: 'u2', displayName: 'Bob', photoURL: '', description: '' }],
      ['u3', { uid: 'u3', displayName: 'Charlie', photoURL: '', description: '' }],
    ] as any);
    component.songs = new Map([
      [1, { id: 1, user: 'u1' }],
      [2, { id: 2, user: 'u1' }],
      [3, { id: 3, user: 'u2' }],
    ] as any);
    component.userGuesses = new Map([
      ['u1', { uid: 'u1', guesses: new Map([[1, 'u2'], [2, 'u3']]) }],
      ['u2', { uid: 'u2', guesses: new Map([[3, 'u1']]) }],
    ] as any);
    component.selectedUser = 'u2';

    const rows = component.getConfusionMatrixRows();
    const aliceRow = rows.find((row) => row.actualUser.uid === 'u1')!;
    const bobRow = rows.find((row) => row.actualUser.uid === 'u2')!;

    expect(component.getConfusionMatrixValue(aliceRow, component.users.get('u1')!)).toBe(0);
    expect(component.getConfusionMatrixValue(aliceRow, component.users.get('u2')!)).toBe(0);
    expect(component.getConfusionMatrixValue(aliceRow, component.users.get('u3')!)).toBe(0);
    expect(component.getConfusionMatrixValue(bobRow, component.users.get('u1')!)).toBe(1);
    expect(bobRow.total).toBe(1);
  });

  it('should compute precision for each user', () => {
    component.users = new Map([
      ['u1', { uid: 'u1', displayName: 'Alice', photoURL: '', description: '' }],
      ['u2', { uid: 'u2', displayName: 'Bob', photoURL: '', description: '' }],
    ] as any);
    component.songs = new Map([
      [1, { id: 1, user: 'u1' }],
      [2, { id: 2, user: 'u2' }],
    ] as any);
    component.userGuesses = new Map([
      ['u1', { uid: 'u1', guesses: new Map([[1, 'u1'], [2, 'u2']]) }],
      ['u2', { uid: 'u2', guesses: new Map([[1, 'u2']]) }],
    ] as any);

    const rows = component.getGuessAccuracyRows();
    const alice = rows.find((row) => row.user.uid === 'u1')!;
    const bob = rows.find((row) => row.user.uid === 'u2')!;

    expect(alice.correct).toBe(2);
    expect(alice.total).toBe(2);
    expect(alice.precision).toBe(100);
    expect(bob.correct).toBe(0);
    expect(bob.total).toBe(1);
    expect(bob.precision).toBe(0);
  });
});
