import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null
  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updateing clip.'
  @Output() update = new EventEmitter()

  editForm = new FormGroup({
    clipID: new FormControl('', { nonNullable: true }),
    title: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  constructor(private modal: ModalService, private clipService: ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip) {
      return
    }

    this.inSubmission = false
    this.showAlert = false
    this.f.clipID.setValue(this.activeClip.docID as string)
    this.f.title.setValue(this.activeClip.title)
  }

  get f() {
    return this.editForm.controls
  }

  async submit() {
    if(!this.activeClip) {
      return
    }
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.'

    try{
      await this.clipService.updateClip(
        this.f.clipID.value, this.f.title.value as string
      )
    }
    catch(e) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong. Try again later'
      return 
    }

    this.activeClip.title = this.f.title.value as string
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'
  }

}
