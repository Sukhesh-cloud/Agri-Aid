import { Component } from '@angular/core';
import { SummarizerService } from 'src/app/services/summarizer.service';

@Component({
  selector: 'app-query-summary',
  templateUrl: './query-summary.component.html',
  styleUrls: ['./query-summary.component.scss']
})
export class QuerySummaryComponent {
  userQuery = '';
  summary = '';
  loading = false;
  listeningMessage = '';
  recognition: any;
  selectedLanguage = 'te'; // Default to Telugu code
  isListening = false;

  // Language options with codes
  languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'hi', name: 'Hindi' }
  ];

  constructor(private aiService: SummarizerService) {}

  ngOnInit() {
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || 
                            (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-IN'; // Input language (English India)
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onaudiostart = () => {
      this.isListening = true;
      this.listeningMessage = '🎤 Listening...';
    };

    this.recognition.onsoundstart = () => {
      this.listeningMessage = '🔊 Detecting sound...';
    };

    this.recognition.onspeechstart = () => {
      this.listeningMessage = '🗣️ Speech detected...';
    };

    this.recognition.onspeechend = () => {
      this.isListening = false;
      this.listeningMessage = '✅ Processing speech...';
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      this.listeningMessage = `❌ Error: ${event.error}`;
      setTimeout(() => this.listeningMessage = '', 3000);
    };

    this.recognition.onresult = (event: any) => {
      this.isListening = false;
      const result = event.results[0][0].transcript;
      this.userQuery = result;
      this.listeningMessage = `📝 You said: "${result}"`;
      this.onSubmit();
    };
  }

  startListening() {
    if (this.isListening) {
      this.recognition.stop();
      return;
    }
    
    this.listeningMessage = '🔄 Starting microphone...';
    this.userQuery = '';
    try {
      this.recognition.start();
    } catch (e) {
      this.listeningMessage = '❌ Microphone access denied';
    }
  }

  onSubmit() {
    if (!this.userQuery.trim()) {
      this.listeningMessage = 'Please enter or speak a query';
      return;
    }

    this.loading = true;
    this.summary = '';
    
    this.aiService.getSummary(this.userQuery, this.selectedLanguage).subscribe({
      next: (res) => {
        this.summary = res.summary;
        this.loading = false;
        this.listeningMessage = `✅ Done (${res.language || this.selectedLanguage})`;
        setTimeout(() => this.listeningMessage = '', 2000);
      },
      error: (err) => {
        console.error(err);
        this.summary = 'Error: ' + (err.error?.error || 'Service unavailable');
        this.loading = false;
        this.listeningMessage = '❌ Failed to get response';
      }
    });
  }
}