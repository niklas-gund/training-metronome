const VARIANT_CLASSES = {
  primary: "bg-ming-800 text-ming-400",
  secondary: "bg-ming-400 text-ming-800",
};

function BaseButton(options: {
  content: JSX.Element;
  variant?: keyof typeof VARIANT_CLASSES;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  return (
    <button
      onClick={(e) => options.onClick?.(e)}
      className={
        "py-3 px-6 rounded-lg mt-2 font-bold uppercase tracking-wider " +
        VARIANT_CLASSES[options.variant ?? "primary"]
      }
    >
      {options.content}
    </button>
  );
}

export default BaseButton;
