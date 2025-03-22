import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { clientService } from '../client.service'; // Assuming your service is set up to handle client operations
import { Client } from '../client';  // Import the Client interface
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html',
  styleUrls: ['./client-add.component.css']
})
export class ClientADDComponent implements OnInit {

  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  clientForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  base64Image: string = '';
  tailleInvalid!: boolean;
  filename!: string;
  filesize!: number;
  pictureArray!: any;
  selectedFile: File | null = null;
  client = new Client();
  file!: File;
  imageUrl!: string;
  base64!: string;
  formData: FormData = new FormData();  // Ensure FormData is initialized here
  profile_image: File | null = null;

  constructor(private fb: FormBuilder, private clientService: clientService, private router: Router) {
    this.clientForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
     
        profile_image: [''], 
      }),
      emailContact: this.fb.group({
        // email: ['', [Validators.required, Validators.email, this.checkEmailExists]],

        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }),
      address: this.fb.group({
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,11}$')]]
      }),
    });
  }

  ngOnInit(): void {}

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

  picked(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('✅ Fichier sélectionné:', file.name, ' | Type:', file.type);
  
      this.selectedFile = file; // Stocke le fichier correctement
  
      this.filename = file.name;
      this.filesize = file.size;
  
      if (this.filesize > 5000000) { 
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
    this.client['profile_image '] = this.base64Image;  

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
  const formValues = this.clientForm.value;
  const formData = new FormData();

  // Ajouter les autres données utilisateur à FormData
 
 formData.append('first_name', formValues.personalInfo.firstName);
 formData.append('last_name', formValues.personalInfo.lastName);
 formData.append('role', formValues.personalInfo.role);
 formData.append('email', formValues.emailContact.email);
 formData.append('password', formValues.emailContact.password);
 formData.append('phone', formValues.address.phone);
 formData.append('address', formValues.address.address);
 formData.append('clientname', formValues.personalInfo.firstName + formValues.personalInfo.lastName);


  if (this.selectedFile) {
    formData.append('profile_image', this.selectedFile, this.selectedFile.name);
  }

  // // Afficher les données envoyées dans FormData
  // console.log("FormData envoyée :");
  // formData.forEach((value, key) => {
  //   console.log(key, value);
  // });

  // Ajouter les autres champs utilisateur au FormData
  for (let key in this.client) {
    if (this.client.hasOwnProperty(key)) {
      formData.append(key, this.client[key]);
    }
  }
  
  this.clientService.create(formData).subscribe(
    data => {
      console.log('Utilisateur créé avec succès:', data);
      this.show = true;
      this.msg = 'Utilisateur ajouté avec succès!';
    },
    error => {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      // Vérifiez si l'erreur contient le message pour l'email existant
      if (error.error && error.error.email && error.error.email[0]) {
        alert('L\'email est déjà utilisé. Veuillez en saisir un autre.');
      } else {
        alert('Erreur lors de la création de l\'utilisateur.');
      }
      this.showError = true;
      this.msg = 'Veuillez remplir tous les champs correctement.';
    }
  );
}


  

  back() {
    this.router.navigate(["/client"]);
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


