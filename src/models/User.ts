// src/models/User.ts

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional in responses
    phoneNumber?: string;
    created_at: string;
  }
  
  // For registration requests
  export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }
  
  // For login requests
  export interface LoginUserDTO {
    email: string;
    password: string;
  }