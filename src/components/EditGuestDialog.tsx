
import React, { useState } from 'react';
import { Guest } from '@/types/guest';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditGuestDialogProps {
  guest: Guest;
  onUpdate: (id: string, name: string, tableNumber: string) => void;
  className?: string;
  showLabel?: boolean;
}

const EditGuestDialog: React.FC<EditGuestDialogProps> = ({ 
  guest, 
  onUpdate, 
  className = "",
  showLabel = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(guest.name);
  const [tableNumber, setTableNumber] = useState(guest.tableNumber);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && tableNumber.trim()) {
      onUpdate(guest.id, name.trim(), tableNumber.trim());
      setIsOpen(false);
      toast({
        title: "Succès",
        description: "L'invité a été modifié avec succès"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Edit className="w-4 h-4" />
          {showLabel && (
            <div className="text-left ml-2">
              <div className="font-medium">Modifier l'invité</div>
              <div className="text-sm text-gray-500">Changer nom ou table</div>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Modifier l'invité</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
  <Label htmlFor="name">Nom de l'invité (Cette fonctionnalité est désactivée pour le mode démo)</Label>
  <Input
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="border-pink-300 focus:border-pink-500"
    disabled
    placeholder="Fonctionnalité désactivée pour le mode démo"
  />
</div>

          <div>
            <Label htmlFor="tableNumber">Numéro de table</Label>
            <Input
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="border-pink-300 focus:border-pink-500"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              Sauvegarder
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGuestDialog;
