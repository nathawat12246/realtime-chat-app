export interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  fullName: string;
  profilePic: string;
}

export interface Message {
  _id: string;
  senderId: string;
  image: string | null;
  text: string | null;
  createdAt: string;
}

export interface MessageContext {
  image: string | null;
  text: string | null;
}