import { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
}

export default function Input({
  label,
  id,
  type = "text",
  placeholder,
  register,
}: IProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <label
        className="text-sm font-semibold capitalize text-zinc-500"
        htmlFor={id}
      >
        {label}
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
