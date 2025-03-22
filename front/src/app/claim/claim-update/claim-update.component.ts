import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { claim} from '../claim';
import { ClaimService } from '../claim.service';

@Component({
  selector: 'app-claim-update',
  templateUrl: './claim-update.component.html',
  styleUrl: './claim-update.component.css'
})
export class ClaimUpdateComponent implements OnInit{

  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  claimForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private router: Router,
    private activeRouter: ActivatedRoute
  )
   {
    this.claimForm = this.fb.group({
      claimInfo: this.fb.group({
        claimname: ['', [Validators.required, Validators.minLength(2)]],
        date_claim: ['', [Validators.required, Validators.minLength(2)]],
        localisation: ['', Validators.required],
        etat:['', Validators.required],
        type_panne: ['', Validators.required],
        image: [''],
      }),
    });
  }

 

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.id = +params['id'];  // Récupérer l'ID depuis les paramètres de la route
      console.log('ID récupéré :', this.id);
      this.getclaimById(this.id);  // Appeler la méthode pour récupérer l'utilisateur par ID
    });
  }
  

  getclaimById(id: number): void {
    this.claimService.getclaimById(id).subscribe(
      (data) => {
        this.claimForm.patchValue({
          claimInfo: {
            claimname: data.claimname,
            date_claim: data.date_claim,
            type_panne:data.type_panne,
          etat:data.etat,
            localisation: data.localisation,
          }
        });
      },
      (error) => {
        console.error('Error fetching claim data:', error);
      }
    );
  }
  

  passwordMatchValidator(formGroup: FormGroup): any {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
    let Claim = new claim ();
    const formValues = this.claimForm.value;
    Claim.claimname = formValues.claimInfo.claimname;
    Claim.date_claim = formValues.claimInfo.date_claim;
    Claim.type_panne = formValues.claimInfo.type_panne;
    Claim.localisation = formValues.claimInfo.localisation;
    Claim.etat = formValues.claimInfo.etat;

  console.log('Données envoyées à l\'API :', Claim); 

  
    this.claimService.updateclaim(this.id, Claim).subscribe(
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
    this.router.navigate(["/claim"]);
  }


  isStepSuccess(step: number): boolean {
    return step < this.currentStep && this.getStepGroup(step).valid;
  }
  
  isStepCompleted(step: number): boolean {
    return step === this.currentStep && this.getStepGroup(step).valid;
  }
  
  getStepGroup(step: number): FormGroup {
    switch (step) {
      case 1: return this.claimForm.get('claimInfo') as FormGroup;
     
      default: return this.claimForm;
    }
  }
  
}
