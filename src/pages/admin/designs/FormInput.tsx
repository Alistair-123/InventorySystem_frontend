type Props = {
  label: string;
  placeholder?: string;
};

export const FormInput = ({ label, placeholder }: Props) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      placeholder={placeholder}
      className="
        px-4 py-2
        rounded-md
        border border-gray-300
        bg-white
        text-gray-800
        focus:outline-none
        focus:ring-2 focus:ring-gray-500
      "
    />
  </div>
);
