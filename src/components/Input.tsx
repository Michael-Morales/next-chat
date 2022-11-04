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
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} {...register} />
    </div>
  );
}
