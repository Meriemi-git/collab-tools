import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Agent, Gadget, Side } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';
import { ConfirmationService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'collab-tools-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'],
})
export class AddAgentComponent implements OnChanges {
  @Input() agent: Agent;
  @Input() gadgets: Gadget[];
  @Output() agentAdded = new EventEmitter<FormData>();
  @Output() agentUpdated = new EventEmitter<FormData>();
  @Output() agentDeleted = new EventEmitter<string>();

  @ViewChild('fileUpload')
  public fileUpload: FileUpload;
  public sides: Side[] = [Side.ATTACKER, Side.DEFENDER];

  public file: File;
  public agentImage: string;

  public agentForm = new FormGroup({
    agentName: new FormControl('', [Validators.required]),
    agentYear: new FormControl('', [Validators.required]),
    agentSeason: new FormControl('', [Validators.required]),
    agentSide: new FormControl('', [Validators.required]),
    agentRoles: new FormControl(''),
    agentDescription: new FormControl(''),
    agentPrimaryGadget: new FormControl('', [Validators.required]),
    agentSecondaryGadgets: new FormControl('', [Validators.required]),
  });
  constructor(
    public readonly ihs: ImageHelperService,
    private readonly confirmationService: ConfirmationService,
    public readonly t: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.agent) {
      this.agentForm.patchValue({
        agentName: this.agent.name,
        agentYear: this.agent.year,
        agentSeason: this.agent.season,
        agentSide: this.agent.side,
        agentRoles: this.agent.roles.join(';'),
        agentDescription: this.agent.description,
        agentPrimaryGadget: this.agent.primaryGadget,
        agentSecondaryGadgets: this.agent.secondaryGadgets,
      });
    }
  }

  public onSubmit() {
    const formData = new FormData();
    if (this.file) {
      formData.set('image', this.file);
    }
    const agent: Agent = {
      _id: this.agent?._id,
      name: this.agentForm.get('agentName')?.value ?? this.agent?.name,
      description:
        this.agentForm.get('agentDescription')?.value ??
        this.agent?.description,
      roles:
        this.agentForm.get('agentRoles')?.value?.split(';') ??
        this.agent?.roles,
      season: this.agentForm.get('agentSeason')?.value ?? this.agent?.season,
      side: this.agentForm.get('agentSide')?.value ?? this.agent?.side,
      year: this.agentForm.get('agentYear')?.value ?? this.agent?.year,
      image: this.agentImage,
      portrait: this.agent?.portrait,
      primaryGadget:
        this.agentForm.get('agentPrimaryGadget')?.value ??
        this.agent?.primaryGadget,
      secondaryGadgets:
        this.agentForm.get('agentSecondaryGadgets')?.value ??
        this.agent?.secondaryGadgets,
    };
    formData.set('agent', JSON.stringify(agent));
    if (this.agent && this.agent._id !== null) {
      this.agentUpdated.emit(formData);
    } else {
      this.agentAdded.emit(formData);
    }
  }
  // Do you really want to delete this agent : ${this.agent.name}
  public onDelete() {
    if (this.agent && this.agent._id) {
      this.confirmationService.confirm({
        key: 'delete-agent-confirmation',
        accept: () => {
          this.agentDeleted.emit(this.agent._id);
          this.clearAgent();
        },
      });
    }
  }

  public onImageUploaded(images: File[]): void {
    this.file = images[0];
  }

  public removeImage() {
    if (this.agent) {
      this.fileUpload.clear();
      this.agentImage = null;
    }
  }

  public clearAgent() {
    this.agentForm.patchValue({
      agentName: null,
      agentYear: null,
      agentSeason: null,
      agentSide: null,
      agentRoles: null,
      agentDescription: null,
      agentPrimaryGadget: null,
      agentSecondaryGadgets: null,
    });
    this.agent = null;
    this.agentImage = null;
    this.file = null;
  }
}
