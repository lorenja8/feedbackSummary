import { Pie } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

type YesNoPieChartProps = {
  questionText: string;
  yes: number;
  no: number;
};

// optionally add function input: questionText
export default function YesNoPieChart({
  yes,
  no,
}: YesNoPieChartProps) {
  const data = {
    labels: ["Yes", "No"],
    datasets: [
      {
        data: [yes, no],
        backgroundColor: ["#34d399", "#f87171"],
        borderColor: ["#065f46", "#7f1d1d"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="p-4 rounded w-1/2">
      {/*<h4 className="font-medium mb-2">{questionText}</h4>*/}
      <Pie data={data} options={options} />
    </div>
  );
}
