import { Resend } from 'resend';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private resend = new Resend('re_YnQ7Z75W_LYH4pJh9TAc1BPCYxJy2A6GZ');

  constructor(private auth: Auth) {}

  async sendEmail(userEmail: string, mailSubject: string, message: string): Promise<void> {
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [userEmail],
      subject: mailSubject,
      text: message,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }

  sendPasswordResetEmail(userEmail: string): Promise<void> {

    return sendPasswordResetEmail(this.auth, userEmail, {
      url: 'http://localhost:8100/sing-in' 
    });
  }

}
