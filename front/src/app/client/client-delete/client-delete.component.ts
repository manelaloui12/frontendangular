import { Component, EventEmitter, Input, Output } from '@angular/core';
import { clientService } from '../client.service';


@Component({
  selector: 'app-client-delete',
  templateUrl: './client-delete.component.html',
  styleUrl: './client-delete.component.css'
})
export class ClientDeleteComponent  {
   @Input('selectedList') selectedList: any[] = [];
    
      @Output()
      close= new EventEmitter<boolean>()
      @Output()
      save= new EventEmitter<boolean>()
      constructor(private clientService:clientService){
    
      }
      closedEvent()
      {
        this.close.emit(true)
      }
      deletelist() {
        if (this.selectedList.length === 0) {
          console.warn("Aucun utilisateur sélectionné !");
          return;
        }
      
        const clientIds = this.selectedList.map(client => client.id_client);
        console.log("Utilisateurs sélectionnés :", clientIds);
      
        this.clientService.deleteMultiple(clientIds).subscribe({
          next: (data: any) => {
            console.log("Réponse après suppression :", data); // Afficher la réponse si la suppression est réussie
            this.save.emit(true);
          },
          error: (error) => {
            // Afficher une erreur si la suppression échoue
            console.error("Erreur lors de la suppression des utilisateurs : ", error);
          }
        });
        
      }
      
      
      
    
    }
    
  
  
  

