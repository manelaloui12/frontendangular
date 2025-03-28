import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css'
})
export class UserDeleteComponent {
   @Input('selectedList') selectedList: any[] = [];
    
      @Output()
      close= new EventEmitter<boolean>()
      @Output()
      save= new EventEmitter<boolean>()
      constructor(private userService:UserService){
    
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
      
        const userIds = this.selectedList.map(user => user.id);
        console.log("Utilisateurs sélectionnés :", userIds);
      
        this.userService.deleteMultiple(userIds).subscribe({
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
    
  
  
  

