// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';

// Angular Fire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/compat/auth";
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { CurrentConstitutionPageComponent } from './components/current-constitution-page/current-constitution-page.component';
import { ConstitutionComponent } from './components/constitution-page/constitution.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { NewConstitutionComponent } from './components/admin-page/new-constitution/new-constitution.component';
import { SongListComponent } from './components/constitution-page/song-list/song-list.component';
import { VotesComponent } from './components/constitution-page/votes/votes.component';
import { OwnerComponent } from './components/constitution-page/owner/owner.component';
import { ResultsComponent } from './components/constitution-page/results/results.component';
import { ExportComponent } from './components/constitution-page/export/export.component';
import { ManageSongsComponent } from './components/constitution-page/manage-songs/manage-songs.component';
import { ParametersComponent } from './components/constitution-page/parameters/parameters.component';
import { DeleteSongWarningComponent } from './components/delete-song-warning/delete-song-warning.component';
import { SongNavigatorComponent } from './components/constitution-page/song-list/song-navigator/song-navigator.component';
import { VoteNavigatorComponent } from './components/constitution-page/votes/votes-grade/vote-navigator/vote-navigator.component';
import { JoinConstitutionComponent } from './components/join-constitution/join-constitution.component';
import { ResultsFavoritesComponent } from './components/constitution-page/results/results-favorites/results-favorites.component';
import { RandomSongComponent } from './components/constitution-page/random-song/random-song.component';
import { ManageInvitesComponent } from './components/admin-page/manage-invites/manage-invites.component';
import { ManageRolesComponent } from './components/admin-page/manage-roles/manage-roles.component';
import { InvitePageComponent } from './components/invite-page/invite-page.component';

// Charts Component
import { HistogramComponent } from './components/template/histogram/histogram.component';
import { RadarComponent } from './components/template/radar/radar.component';
import { ScatterComponent } from './components/template/scatter/scatter.component';
import { PieComponent } from './components/template/pie/pie.component';
import { HeatmapComponent } from './components/template/heatmap/heatmap.component';
import { ChordComponent } from './components/template/chord/chord.component';

// Grade Component
import { GradeOwnerComponent } from './components/constitution-page/owner/grade-owner/grade-owner.component';
import { VotesGradeComponent } from './components/constitution-page/votes/votes-grade/votes-grade.component';
import { ResultsGradeComponent } from './components/constitution-page/results/results-grade/results-grade.component';
import { GradeProfileComponent } from './components/constitution-page/results/results-grade/grade-profile/grade-profile.component';
import { GradeRankingComponent } from './components/constitution-page/results/results-grade/grade-ranking/grade-ranking.component';
import { GradeRanksComponent } from './components/constitution-page/results/results-grade/grade-ranks/grade-ranks.component';
import { GradeGradesComponent } from './components/constitution-page/results/results-grade/grade-grades/grade-grades.component';
import { GradeAverageComponent } from './components/constitution-page/results/results-grade/grade-average/grade-average.component';
import { GradeElectoralComponent } from './components/constitution-page/results/results-grade/grade-electoral/grade-electoral.component';
import { GradeRelationshipComponent } from './components/constitution-page/results/results-grade/grade-relationship/grade-relationship.component';

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule} from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// MDB
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Services
import { AuthService } from './services/auth.service';

@NgModule({
	declarations: [
		AppComponent,
		ProfilePageComponent,
		NavbarComponent,
		HomePageComponent,
		UsersPageComponent,
		CurrentConstitutionPageComponent,
		ConstitutionComponent,
		AdminPageComponent,
		NewConstitutionComponent,
		SongListComponent,
		VotesComponent,
		OwnerComponent,
		ResultsComponent,
		ExportComponent,
		ManageSongsComponent,
  	ParametersComponent,
  	DeleteSongWarningComponent,
    SongNavigatorComponent,
    GradeOwnerComponent,
    VotesGradeComponent,
    HistogramComponent,
    VoteNavigatorComponent,
    JoinConstitutionComponent,
    ResultsGradeComponent,
  	GradeProfileComponent,
    GradeRanksComponent,
    GradeGradesComponent,
    GradeAverageComponent,
		GradeRankingComponent,
  	RadarComponent,
  	ScatterComponent,
		ResultsFavoritesComponent,
		PieComponent,
		GradeElectoralComponent,
  	RandomSongComponent,
		GradeRelationshipComponent,
		HeatmapComponent,
	 	ChordComponent,
	 	ManageInvitesComponent,
    ManageRolesComponent,
    InvitePageComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		TextFieldModule,
		HttpClientModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatSliderModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatSidenavModule,
		MatSlideToggleModule,
		MatListModule,
		MatTabsModule,
		MatMenuModule,
		MatDialogModule,
		MatExpansionModule,
		MatProgressBarModule,
		MatSnackBarModule,
		MatStepperModule,
		MatProgressSpinnerModule,
		MdbDropdownModule,
		MdbCollapseModule
	],
	providers: [
		AuthService,
		{ provide: PERSISTENCE, useValue: 'local' },  // Firebase login persitance
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
