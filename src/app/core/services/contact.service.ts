
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
    emailStatus: 'pending' | 'sent' | 'failed';
    createdAt: string;
  };
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  emailStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiBaseUrl}/contact`;

  sendMessage(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, payload);
  }

  getMessages(page = 1, limit = 10, status?: string) {
    let params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };

    if (status) {
      params = { ...params, status };
    }

    return this.http.get<{
      success: boolean;
      data: ContactMessage[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(this.apiUrl, { params });
  }

  getMessage(id: string) {
    return this.http.get<{
      success: boolean;
      data: ContactMessage;
    }>(`${this.apiUrl}/${id}`);
  }

  updateStatus(
    id: string,
    status: ContactMessage['status'],
  ) {
    return this.http.patch<{
      success: boolean;
      message: string;
      data: ContactMessage;
    }>(`${this.apiUrl}/${id}/status`, { status });
  }
}
