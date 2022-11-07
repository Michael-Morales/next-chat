import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  action?: () => void;
  danger?: boolean;
}

export default function Button({
  children,
  type = "button",
  action,
  danger,
  disabled,
}: IProps) {
  return (
    <button
      className={`rounded ${
        danger
          ? "bg-red-500 hover:bg-red-300 focus-visible:bg-red-300 disabled:bg-red-300"
          : "bg-sky-500 hover:bg-sky-300 focus-visible:bg-sky-300 disabled:bg-sky-300"
      } py-2 px-4 font-bold capitalize text-zinc-50 transition-colors`}
      type={type}
      onClick={action}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
