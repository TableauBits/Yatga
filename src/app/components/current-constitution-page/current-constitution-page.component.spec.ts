import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentConstitutionPageComponent } from './current-constitution-page.component';

describe('CurrentConstitutionPageComponent', () => {
	let component: CurrentConstitutionPageComponent;
	let fixture: ComponentFixture<CurrentConstitutionPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CurrentConstitutionPageComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CurrentConstitutionPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
