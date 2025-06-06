"use client";
import { useAlertStore } from "@/stores/alert-store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

export function Alert() {
  const { alert, hideAlert } = useAlertStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");

  // Don't show if no content and no buttons
  const shouldShow = alert.message || alert.title || alert.buttons.length > 0;

  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true);
      setIsExiting(false);
      // Reset text field value and set default if provided
      setTextFieldValue(alert.textField?.defaultValue || "");
    }
  }, [shouldShow, alert.textField?.defaultValue]);

  const handleButtonClick = (
    buttonAction?: (textFieldValue?: string) => void
  ) => {
    // Start exit animation
    setIsExiting(true);

    // Wait for animation to complete before actually hiding
    setTimeout(() => {
      setIsVisible(false);
      if (buttonAction) {
        buttonAction(textFieldValue);
      } else {
        hideAlert();
      }
    }, 200); // Match animation duration
  };

  if (!shouldShow && !isVisible) return null;

  // Fallback to default OK button if no buttons are configured
  const buttons =
    alert.buttons.length > 0
      ? alert.buttons
      : [{ text: "OK", action: undefined, primary: true }];

  return (
    <div
      className={`
        fixed inset-0 bg-black/50 flex items-center justify-center z-50 
        transition-opacity duration-200 ease-out
        ${isExiting ? "opacity-0" : "opacity-100"}
      `}
    >
      <div
        className={`
          bg-background-secondary w-[280px] rounded-xl shadow-2xl
          transition-all duration-200 ease-out
          ${
            isExiting
              ? "scale-95 opacity-0"
              : "scale-100 opacity-100 animate-in zoom-in-95 fade-in"
          }
        `}
      >
        <div className="p-4 flex flex-col items-center gap-1">
          {alert.title && (
            <h2 className="text-base font-semibold text-center">
              {alert.title}
            </h2>
          )}
          {alert.message && (
            <p className="text-sm text-center text-muted-foreground">
              {alert.message}
            </p>
          )}
          {alert.textField && (
            <div className="w-full mt-3">
              <Input
                type={alert.textField.type || "text"}
                placeholder={alert.textField.placeholder}
                value={textFieldValue}
                onChange={(e) => setTextFieldValue(e.target.value)}
                className="bg-background border"
                autoFocus
              />
            </div>
          )}
        </div>
        <div
          className={`flex border-t border-border ${buttons.length === 1 ? "" : "divide-x divide-border"}`}
        >
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={() => handleButtonClick(button.action)}
              variant="ghost"
              className={`
                ${buttons.length === 1 ? "w-full" : "flex-1"}
                text-[1rem] rounded-none h-10 active:opacity-70 rounded-b-xl
                ${button.primary ? "!text-blue-500 font-medium" : "!text-blue-500"}
              `}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
