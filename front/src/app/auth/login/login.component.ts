import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showError: boolean = false;
  message: string = '';

  email: string = '';
  password: string = '';
  role: string = '';  // Store the selected role
  errorMessage: string = '';

  // constructor(private authService: AuthService, private router: Router) {}
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      rememberMe: [false],
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.isLoading = true;
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 24)
    console.log("form",this.authForm.value)
    this.authService.login(this.authForm.value).subscribe({
     next: (response) => {
      console.log("response",response)      
      this.authService.findUserToken(response.key).subscribe(data=>{
        this.router.navigateByUrl('/user'); 
        document.cookie = `username=${encodeURIComponent(data.username)}; expires=${expireDate.toUTCString()}; path=/`;
        document.cookie = `id=${data.id}; expires=${expireDate.toUTCString()}; path=/`;
        document.cookie = `email=${encodeURIComponent(data.email)}; expires=${expireDate.toUTCString()}; path=/`;
        document.cookie = `token=${encodeURIComponent(response.key)}; expires=${expireDate.toUTCString()}; path=/`;
      })
       


      
        this.isLoading = false;
      },
      error: () => {
        this.showError = true;
        this.message = 'Erreur de connexion. Veuillez réessayer.';
        this.isLoading = false;
      },
    });
  }

  storeCredentials(user: any): void {
    localStorage.setItem('token', user.access_token);
    localStorage.setItem('id', user.userId);
    document.cookie = `token=${user.access_token}; Max-Age=${user.expiresIn}; path=/`;
  }
}










