import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-disease-detection',
  templateUrl: './disease-detection.component.html',
  styleUrls: ['./disease-detection.component.scss']
})
export class DiseaseDetectionComponent {
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  predictionResult: any = null;
  isLoading = false;
  isDragOver = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
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
      this.error = null;
      this.predictionResult = null;
      
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
    this.predictionResult = null;
    this.error = null;
  }

  submit() {
    if (!this.selectedImage) return;

    const formData = new FormData();
    formData.append('image', this.selectedImage);

    this.isLoading = true;
    this.error = null;

    this.http.post<any>('http://localhost:5001/predict-disease', formData).subscribe({
      next: res => {
        console.log('API Response:', res);

        const label = res.predicted_label.replace(/___|__/g, ' - ').replace(/_/g, ' ');
        this.predictionResult = {
          label: label,
          confidence: res.confidence,
          rawLabel: res.predicted_label
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.error = 'Failed to analyze the image. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-danger';
  }

  getConfidenceIcon(confidence: number): string {
    if (confidence >= 0.8) return '✓';
    if (confidence >= 0.6) return '⚠';
    return '⚠';
  }
}