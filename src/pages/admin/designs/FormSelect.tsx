type Props = {
  label: string;
  options: string[];
};

export const FormSelect = ({ label, options }: Props) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      className="
        px-4 py-2
        rounded-md
        border border-gray-300
        bg-white
        text-gray-800
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
      "
    >
      {options.map(opt => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
