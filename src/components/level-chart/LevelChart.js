import Chart from "react-apexcharts";

export default function LevelChart() {

  const options = {
    chart: {
      // height: 500,
    },
    plotOptions: {
      radialBar: {
        // startAngle: -135,
        // endAngle: 135,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#293450"
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
        dataLabels: {
          name: {
            color: "#FFF",
            show: true,
            fontSize: '20px',
          },
          value: {
            show: true,
            color: "#FFF",
            fontSize: '26px',
            formatter: (val) => `${val}%`
          },
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#87D4F9"],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: "round"
    },
    labels: ['Fresh water'],
  }

  return (
          <Chart
            options={options}
            series={[80]}
            labels={['Fresh water']}
            type="radialBar"
            width="500"
          />
  );
}