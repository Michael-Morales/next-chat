import { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export default function Input({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
}: IProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <label
        className="flex items-center justify-between text-xs font-semibold text-zinc-500"
        htmlFor={id}
      >
        <span className="capitalize">{label}</span>
        <span className="text-red-500">{error}</span>
      </label>
      <input
        className="rounded border-zinc-500 bg-transparent placeholder:text-zinc-400"
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
      />
    </div>
  );
}
