import { Component, OnInit } from '@angular/core';
import { clientService } from '../client.service';
import { Router } from '@angular/router';
import { Client } from '../client'; 

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})


export class ClientListComponent implements OnInit {

  selectAll: boolean = false; // Flag to track "select all" checkbox state
  isButtonDisabled: boolean = true; // Disable buttons initially
  count: number=0;
  close: boolean=false;
  showConfirmation: boolean = false;
  // clientToDelete: any = null; 
  clientId!: number; 
  clients: Client[] = [];

 

  constructor(private clientService: clientService , private router:Router) { }

  ngOnInit(): void {
    this.getListclient();
  }


  // Method to handle checkbox changes and update button status
  onCheckboxChange() {
    this.isButtonDisabled = this.selectedclients.length !== 1; // Button enabled only when one client is selected
    console.log(this.isButtonDisabled)
    console.log(this.selectedclients)
    console.log('selectedclients[0].id',this.selectedclients[0].id_client)
  }

  // Helper method to get the number of selected clients
  get selectedclients() {
    return this.clients.filter(client=> client.selected); // Filters clients that are selected
  }

  // Method to toggle the selection of all clients
  toggleSelectAll() {
    this.clients.forEach(client => client.selected = this.selectAll);
    this.onCheckboxChange();  // Update button state after toggling "select all"
  }

  // Method to check if all clients are selected, used to update "select all" checkbox
  checkIfAllSelected() {
    this.selectAll = this.clients.every(client => client.selected);
  }

  // Method to update "select all" checkbox when a single client is selected or deselected
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
    this.getListclient(); // Rafraîchir la liste des utilisateurs après suppression
  }
  

  deleteSelectedclients() {
    const selectedIds = this.selectedclients.map(client => client.id_client);
    console.log("Utilisateurs à supprimer:", selectedIds);
  
    if (selectedIds.length === 0) {
      console.warn("Aucun utilisateur sélectionné !");
      return;
    }
  
    this.clientService.deleteclients(selectedIds).subscribe({
      next: () => {
        this.clients = this.clients.filter(client => !selectedIds.includes(client.id_client));
        this.selectAll = false;
        console.log("Utilisateurs supprimés avec succès.");
      },
      error: (err) => console.error("Erreur suppression:", err)
    });
  }
  

getListclient() {
  this.clientService.listclient().subscribe(data => {
    console.log("Réponse API - Utilisateurs : ", data);
    this.clients = data;  // Assure-toi que cette ligne est correctement exécutée et que 'data' contient la bonne structure
    this.count = data.length;  // Si tu veux également mettre à jour le nombre d'utilisateurs
  }, error => {
    console.error("Erreur API lors de la récupération des utilisateurs : ", error);
  });
}

  editRouter(): void {
    if (this.selectedclients && this.selectedclients.length > 0) {
      const id = this.selectedclients[0].id_client;
      // Vérifiez que l'ID est correct
      console.log('ID de l\'utilisateur :', id);
      this.router.navigate(['/client/update-client', id]); // Naviguer avec l'ID
    } else {
      console.log('Aucun utilisateur sélectionné');
    }
  }
}

