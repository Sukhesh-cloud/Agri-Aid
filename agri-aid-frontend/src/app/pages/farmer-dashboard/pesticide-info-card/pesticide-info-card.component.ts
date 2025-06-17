import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pesticide-info-card',
  templateUrl: './pesticide-info-card.component.html',
  styleUrls: ['./pesticide-info-card.component.scss']
})
export class PesticideInfoCardComponent {
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  result: any = null;
  loading = false;
  error: string = '';
  language: string = 'en';
  isDragOver = false;

  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  private handleFileSelection(file: File) {
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      this.error = '';
      this.result = null;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.error = 'Please select a valid image file.';
    }
  }

  clearSelection() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.result = null;
    this.error = '';
  }

  onSubmit() {
    if (!this.selectedImage) return;
    
    this.loading = true;
    this.error = '';
    
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('language', this.language);

    this.http.post('http://localhost:5001/scan-pesticide', formData).subscribe({
      next: (res: any) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to scan pesticide label. Please try again.';
        this.loading = false;
      }
    });
  }

  getSelectedLanguage() {
    return this.languages.find(lang => lang.code === this.language) || this.languages[0];
  }

  getSafetyLevel(pesticide: string): { level: string, color: string, icon: string } {
    // Simple safety classification based on common pesticide types
    const lowRisk = ['neem', 'organic', 'bio', 'natural'];
    const highRisk = ['paraquat', 'chlorpyrifos', 'endosulfan', 'carbofuran'];
    
    const pesticideLower = pesticide.toLowerCase();
    
    if (lowRisk.some(keyword => pesticideLower.includes(keyword))) {
      return { level: 'Low Risk', color: 'success', icon: 'shield-check' };
    } else if (highRisk.some(keyword => pesticideLower.includes(keyword))) {
      return { level: 'High Risk', color: 'danger', icon: 'exclamation-triangle' };
    } else {
      return { level: 'Moderate Risk', color: 'warning', icon: 'shield-alt' };
    }
  }
}