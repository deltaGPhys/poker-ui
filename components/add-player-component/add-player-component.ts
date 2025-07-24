import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, NgClass} from '@angular/common';
import {PlayerService} from '../../services/player-service';
import {Player} from '../../models';

@Component({
  selector: 'app-add-player-component',
  imports: [
    ReactiveFormsModule,
    NgClass,
    CommonModule,
  ],
  templateUrl: './add-player-component.html',
  styleUrl: './add-player-component.scss'
})
export class AddPlayerComponent {
  playerForm: FormGroup = new FormGroup({});
  submitted = false;
  toggle = false;
  width = 10;
  height = 10;

  @Input() player!: Player;

  get f() { return this.playerForm.controls; }

  constructor(private formBuilder: FormBuilder, private playerService: PlayerService) {
  }

  ngOnInit() {
    this.prepareForm();
  }

  addPlayer() {
    this.prepareForm();
    this.toggle = true;
  }

  private prepareForm() {
    this.playerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  public onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.playerForm.invalid) {
      return;
    }

    this.playerService.sitPlayer(this.player, this.f['name'].value);
    // this.hide = true;
    this.toggle = false;
  }

}
