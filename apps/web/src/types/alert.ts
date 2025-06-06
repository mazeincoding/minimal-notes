export interface AlertTextField {
  placeholder?: string;
  defaultValue?: string;
  type?: "text" | "password" | "email" | "number";
}

export interface AlertButton {
  text: string;
  action?: (textFieldValue?: string) => void;
  primary?: boolean;
}

export interface IAlert {
  title: string | null;
  message: string | null;
  textField?: AlertTextField;
  buttons: AlertButton[];
}
