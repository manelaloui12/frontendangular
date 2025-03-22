import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user'; 

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})


export class ListUserComponent implements OnInit {

  selectAll: boolean = false; // Flag to track "select all" checkbox state
  isButtonDisabled: boolean = true; // Disable buttons initially
  count: number=0;
  close: boolean=false;
  showConfirmation: boolean = false;
  // userToDelete: any = null; 
  userId!: number; 
  users: User[] = [];

 

  constructor(private userService: UserService , private router:Router) { }

  ngOnInit(): void {
    this.getListUser();
  }


  // Method to handle checkbox changes and update button status
  onCheckboxChange() {
    this.isButtonDisabled = this.selectedUsers.length !== 1; // Button enabled only when one user is selected
    console.log(this.isButtonDisabled)
    console.log(this.selectedUsers)
    console.log('selectedUsers[0].id',this.selectedUsers[0].id)
  }

  // Helper method to get the number of selected users
  get selectedUsers() {
    return this.users.filter(user=> user.selected); // Filters users that are selected
  }

  // Method to toggle the selection of all users
  toggleSelectAll() {
    this.users.forEach(user => user.selected = this.selectAll);
    this.onCheckboxChange();  // Update button state after toggling "select all"
  }

  // Method to check if all users are selected, used to update "select all" checkbox
  checkIfAllSelected() {
    this.selectAll = this.users.every(user => user.selected);
  }

  // Method to update "select all" checkbox when a single user is selected or deselected
  updateSelectAll() {
    this.checkIfAllSelected();
  }
  actionOpen() {
    this.close = true; // Afficher la boîte de dialogue
  }
  
  actionClose() {
    this.close = false; // Fermer la boîte de dialogue
  }
  
  actionSave() {
    this.close = false;
    this.getListUser(); // Rafraîchir la liste des utilisateurs après suppression
  }
  

  deleteSelectedUsers() {
    const selectedIds = this.selectedUsers.map(user => user.id);
    console.log("Utilisateurs à supprimer:", selectedIds);
  
    if (selectedIds.length === 0) {
      console.warn("Aucun utilisateur sélectionné !");
      return;
    }
  
    this.userService.deleteUsers(selectedIds).subscribe({
      next: () => {
        this.users = this.users.filter(user => !selectedIds.includes(user.id));
        this.selectAll = false;
        console.log("Utilisateurs supprimés avec succès.");
      },
      error: (err) => console.error("Erreur suppression:", err)
    });
  }
  

// getListUser() {
//   this.userService.listUser().subscribe(data => {
//     console.log("Réponse API - Utilisateurs : ", data);
//     this.users = data;  // Assure-toi que cette ligne est correctement exécutée et que 'data' contient la bonne structure
//     this.count = data.length;  // Si tu veux également mettre à jour le nombre d'utilisateurs
//   }, error => {
//     console.error("Erreur API lors de la récupération des utilisateurs : ", error);
//   });
// }
getListUser() {
  this.userService.listUser().subscribe(
    data => {
      console.log("Users from API:", data);
      this.users = data;
      this.count = data.length;
    },
    error => {
      console.error("Error fetching users:", error);
    }
  );
}

  editRouter(): void {
    if (this.selectedUsers && this.selectedUsers.length > 0) {
      const id = this.selectedUsers[0].id;
      // Vérifiez que l'ID est correct
      console.log('ID de l\'utilisateur :', id);
      this.router.navigate(['/user/update-user', id]); // Naviguer avec l'ID
    } else {
      console.log('Aucun utilisateur sélectionné');
    }
  }
  
  
}
