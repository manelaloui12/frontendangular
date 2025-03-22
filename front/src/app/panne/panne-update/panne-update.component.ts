import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { panne } from '../panne';
import { PanneService } from '../panne.service';

@Component({
  selector: 'app-panne-update',
  templateUrl: './panne-update.component.html',
  styleUrl: './panne-update.component.css'
})
export class PanneUpdateComponent implements OnInit {

currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  panneForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private panneService: PanneService ,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.panneForm = this.fb.group({

      Panneinfo: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(2)]],
        breakdown_type: ['', [Validators.required, Validators.minLength(2)]],
   
      }),
      PanneInfo: this.fb.group({
       
        date_signalement: ['', [Validators.required]],
        
      }),
      AdresseInfo: this.fb.group({
        adresse:['', Validators.required],
        ville: ['', Validators.required],
        position: ['', Validators.required],
      }),
   
    });
  }

 

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.id = +params['id'];  // Récupérer l'ID depuis les paramètres de la route
      console.log('ID récupéré :', this.id);
      this.getpanneById(this.id);  // Appeler la méthode pour récupérer l'utilisateur par ID
    });
  }
  

  getpanneById(id: number): void {
    this.panneService.getpanneById(id).subscribe(
      (data) => {
        this.panneForm.patchValue({
          panneinfo: {
            title: data.title,
            breackdown_type: data.breakdown_type,
          },
          PanneInfo: {
            date_signalement: data.date_signalement,
          },
          AdresseInfo: {
            adresse:data.adresse,
            ville:data.ville,
            position: data.position,
        }
      });
    },
      (error) => {
        console.error('Error fetching panne data:', error);
      }
    );
  }
  

 
  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToNextStep(): void {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }

  onSubmit(): void {
    console.log('Form submitted'); 
    let breakdown = new panne();

    const formValues = this.panneForm.value;
    breakdown.title = formValues.Panneinfo.title;
    breakdown.breakdown_type = formValues.Panneinfo.breackdown_type;
    breakdown.date_signalement = formValues.PanneInfo.date_signalement;
    breakdown.adresse=formValues.AdresseInfo.adresse;
    breakdown.ville=formValues.AdresseInfo.ville

    breakdown.position=formValues.AdresseInfo.position

 

  console.log('Données envoyées à l\'API :', breakdown); 

  
    this.panneService.updatepanne(this.id, breakdown).subscribe(
      (data) => {
        this.show = true;
        this.msg = "Utilisateur modifié avec succès !";
        console.log('Données retournées par l\'API', data);  // Vérifiez les données retournées par l'API
      },
      (error) => {
        this.showError = true;
        this.msg = "Veuillez remplir tous les champs correctement";
        console.error(error); // Ajoutez cette ligne pour afficher l'erreur dans la console
      });
  }

   
  back(): void {
    this.router.navigate(["/panne"]);
  }


  isStepSuccess(step: number): boolean {
    return step < this.currentStep && this.getStepGroup(step).valid;
  }
  
  isStepCompleted(step: number): boolean {
    return step === this.currentStep && this.getStepGroup(step).valid;
  }
  
  getStepGroup(step: number): FormGroup {
    switch (step) {
      case 1: return this.panneForm.get('Panneinfo') as FormGroup;
      case 2: return this.panneForm.get('PanneInfo') as FormGroup;
      case 3: return this.panneForm.get('AdresseInfo') as FormGroup;
      default: return this.panneForm;
    }
  }
  
}
