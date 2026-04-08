import { Progress } from "@/components/ui/progress";

export default function ProbabilityBar({ label, value }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold text-foreground">
        <span className="truncate max-w-[70%]">{label}</span>
        <span className="text-primary">{(value * 100).toFixed(0)}%</span>
      </div>
      <Progress value={value * 100} className="h-2" />
    </div>
  );
}
