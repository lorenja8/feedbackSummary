import { Bar } from "react-chartjs-2";

type RatingHistogramProps = {
  questionText: string;
  distribution: Record<string, number>;
};

export default function RatingHistogram({
  questionText,
  distribution,
}: RatingHistogramProps) {
  // distribution is e.g. { "1": 2, "2": 5, "3": 12, "4": 4, "5": 1 }

  const labels = Object.keys(distribution).sort((a, b) => Number(a) - Number(b));
  const values = labels.map((l) => distribution[l]);

  const data = {
    labels,
    datasets: [
      {
        label: questionText,
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-4 rounded shadow-sm w-full">
      {/*<h4 className="font-medium mb-2">{questionText}</h4>*/}
      <Bar data={data} options={options} />
    </div>
  );
}
