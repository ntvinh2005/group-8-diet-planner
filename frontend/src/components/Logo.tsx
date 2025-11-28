export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img src="/budgetbits.svg" alt="BudgetBits Logo" className={className} />
  );
}
