interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  profileImage: string;
  bio?: string;
  contactInfo?: string;
}

interface SignInData {
  email: string;
  password: string;
}
