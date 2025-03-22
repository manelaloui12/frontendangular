import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})

export class UserADDComponent implements OnInit {
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  userForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  base64Image: string = '';
  tailleInvalid!: boolean;
  filename!: string;
  filesize!: number;
  pictureArray!: any;
  selectedFile: File | null = null;
  user = new User();
  file!: File;
  imageUrl!: string;
  base64!: string;
  formData: FormData = new FormData();  // Ensure FormData is initialized here
  profile_image: File | null = null;
  isSubmitting: boolean = false;
  sanitizer: any;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.userForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        role: ['', Validators.required],
        profile_image: [''], // Add profile_image field
      }),
      emailContact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }),
      address: this.fb.group({
        address: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,11}$')]] // Phone number validation
      }),
    });
  }

  ngOnInit(): void {}

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // goToNextStep(): void {
  //   if (this.currentStep < this.maxSteps) {
  //     this.currentStep++;
  //   }
  // }
goToNextStep(): void {
  if (this.currentStep < this.maxSteps) {
    this.currentStep++;
    this.imageUrl = ''; // Clear the image when stepping to the next step
  }
}

  picked(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('✅ Fichier sélectionné:', file.name, ' | Type:', file.type);
  
      this.selectedFile = file; // Stocke le fichier correctement
  
      this.filename = file.name;
      this.filesize = file.size;
  
      if (this.filesize > 5000000) { // 5MB limit
        this.tailleInvalid = true;
        alert("Fichier trop volumineux (Max: 5MB)");
        return;
      }
      this.tailleInvalid = false;
  
      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner un fichier image valide.");
        return;
      }
      this.handleInputChange(file);

    } else {
      console.log("⚠️ Aucun fichier sélectionné.");
    }
  }


  handleInputChange(file: File) {
    const reader = new FileReader();
    if (!file.type.match(/image-*/)) {
      return; // Invalid image format
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  async _handleReaderLoaded(e: any) {
    this.base64Image = e.target.result;
    console.log('Image Base64:', this.base64Image);
    this.user['image'] = this.base64Image;
  }
  onImageSelected(event: any) {
    this.profile_image = event.target.files[0];  // Store the selected file
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
        const file = input.files[0];
        
        // Vérifiez que c'est bien une image
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner un fichier image.');
            return;
        }
  
        // Stockez le fichier sélectionné dans la variable selectedFile
        this.selectedFile = file;
        
        // Mettez à jour l'URL de l'image pour l'afficher en prévisualisation
        this.imageUrl = URL.createObjectURL(file);
  
        console.log('Fichier sélectionné:', file.name, 'Type:', file.type);
    } else {
        console.log('⚠️ Aucun fichier sélectionné.');
    }
  }

  onSubmit() {
    const formValues = this.userForm.value;
    const formData = new FormData();
  
    // Add user details to FormData
    formData.append('first_name', formValues.personalInfo.firstName);
    formData.append('last_name', formValues.personalInfo.lastName);
    formData.append('role', formValues.personalInfo.role);
    formData.append('email', formValues.emailContact.email);
    formData.append('password', formValues.emailContact.password);
    formData.append('phone_number', formValues.address.phone_number);
    formData.append('address', formValues.address.address);
    formData.append('username', formValues.personalInfo.firstName + formValues.personalInfo.lastName);
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile, this.selectedFile.name);
    }
    
    // // Check if there is a selected file and append it to FormData
    // if (this.selectedFile) {
    //   formData.append('profile_image', this.selectedFile, this.selectedFile.name);
    //   console.log('✅ Fichier ajouté au FormData:', this.selectedFile.name);

    // } else {
    //   console.log("⚠️ Aucun fichier sélectionné.");
    // }
 
    for (let key in this.user) {
      if (this.user.hasOwnProperty(key)) {
        formData.append(key, this.user[key]);
      }
    }
   
  
    this.userService.create(formData).subscribe(
      data => {
        console.log('User successfully created:', data);
        this.show = true;
        this.msg = 'Utilisateur ajouté avec succès!';
      },
      error => {
        console.error('Error during user creation:', error);
        this.showError = true;
        this.msg = 'Veuillez remplir tous les champs correctement.';
      }
    );
  }


  back() {
    this.router.navigate(["/user"]);
  }

  finishStepper(): void {
    this.isFinalStep = true;
  }

  isStepSuccess(step: number): boolean {
    return false;
  }

  isStepCompleted(step: number): boolean {
    return false;
  }
}
