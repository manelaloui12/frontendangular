import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Client } from '../client';
import { clientService } from '../client.service';

@Component({
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent implements OnInit {
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  clientForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private clientService: clientService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      personalInfo: this.fb.group({
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
       
     
      }),
      emailContact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, { validator: this.passwordMatchValidator }),
      address: this.fb.group({
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,11}$')]] // Phone number validation
      }),
    });
  }

 

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.id = +params['id'];  // Récupérer l'ID depuis les paramètres de la route
      console.log('ID récupéré :', this.id);
      this.getclientById(this.id);  // Appeler la méthode pour récupérer l'utilisateur par ID
    });
  }
  

  getclientById(id: number): void {
    this.clientService.getclientById(id).subscribe(
      (data) => {
        this.clientForm.patchValue({
          personalInfo: {
            first_name: data.first_name,
            last_name: data.last_name,
           
          },
          emailContact: {
            email: data.email
          },
          
          address: {
            address: data.address,
            phone: data.phone
          }
        });
      },
      (error) => {
        console.error('Error fetching client data:', error);
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
    let client = new Client ();
    const formValues = this.clientForm.value;
    client.first_name = formValues.personalInfo.first_name;
    client.last_name = formValues.personalInfo.last_name;
    client.email = formValues.emailContact.email;  // Assurez-vous que cela récupère bien la valeur du champ email
    client.phone = formValues.address.phone;
    client.address = formValues.address.address;

  console.log('Données envoyées à l\'API :', client); 

  
    this.clientService.updateclient(this.id, client).subscribe(
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
    this.router.navigate(["/client"]);
  }


  isStepSuccess(step: number): boolean {
    return step < this.currentStep && this.getStepGroup(step).valid;
  }
  
  isStepCompleted(step: number): boolean {
    return step === this.currentStep && this.getStepGroup(step).valid;
  }
  
  getStepGroup(step: number): FormGroup {
    switch (step) {
      case 1: return this.clientForm.get('personalInfo') as FormGroup;
      case 2: return this.clientForm.get('emailContact') as FormGroup;
      case 3: return this.clientForm.get('address') as FormGroup;
      default: return this.clientForm;
    }
  }
  
}
