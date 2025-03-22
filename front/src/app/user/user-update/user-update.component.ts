import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  userForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      personalInfo: this.fb.group({
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
        role: ['', Validators.required],
     
      }),
      emailContact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, { validator: this.passwordMatchValidator }),
      address: this.fb.group({
        address: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,11}$')]] // Phone number validation
      }),
    });
  }

 

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.id = +params['id'];  // Récupérer l'ID depuis les paramètres de la route
      console.log('ID récupéré :', this.id);
      this.getUserById(this.id);  // Appeler la méthode pour récupérer l'utilisateur par ID
    });
  }
  

  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe(
      (data) => {
        this.userForm.patchValue({
          personalInfo: {
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
          },
          emailContact: {
            email: data.email
          },
          
          address: {
            address: data.address,
            phone_number: data.phone_number
          }
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
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
    let user = new User();
    const formValues = this.userForm.value;
   user.first_name = formValues.personalInfo.first_name;
   user.last_name = formValues.personalInfo.last_name;
   user.role = formValues.personalInfo.role;
   user.email = formValues.emailContact.email;  // Assurez-vous que cela récupère bien la valeur du champ email
   user.phone_number = formValues.address.phone_number;


  console.log('Données envoyées à l\'API :', user); 

  
    this.userService.updateUser(this.id, user).subscribe(
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
    this.router.navigate(["/user"]);
  }


  isStepSuccess(step: number): boolean {
    return step < this.currentStep && this.getStepGroup(step).valid;
  }
  
  isStepCompleted(step: number): boolean {
    return step === this.currentStep && this.getStepGroup(step).valid;
  }
  
  getStepGroup(step: number): FormGroup {
    switch (step) {
      case 1: return this.userForm.get('personalInfo') as FormGroup;
      case 2: return this.userForm.get('emailContact') as FormGroup;
      case 3: return this.userForm.get('address') as FormGroup;
      default: return this.userForm;
    }
  }
  
}
