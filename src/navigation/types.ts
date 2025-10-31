export type RootStackParamList = {
  // Auth
  Welcome: undefined;
  Signup: undefined;
  OTPVerification: { email: string };

  // App root (stack)
  MainTabs: undefined;   // ← Tab navigator container
  QRDisplay: undefined;
  SetupWizard: undefined;
};
