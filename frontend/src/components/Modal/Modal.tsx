interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ children, className = "" }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-sm rounded-2xl bg-[#1f1f1f] p-6 shadow-xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
