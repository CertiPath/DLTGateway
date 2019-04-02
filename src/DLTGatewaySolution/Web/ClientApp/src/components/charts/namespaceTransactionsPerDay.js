import React, { PureComponent } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

const AreaChartdata = {
    options: {
        animation: {
            duration: 1000, // general animation time
            easing: "easeOutBack"
        },
        hover: {
            animationDuration: 1000 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 1000, // animation duration after a resize
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    display: true,
                    gridLines: {
                        color: "#f3f3f3",
                        drawTicks: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Month"
                    }
                }
            ],
            yAxes: [
                {
                    display: true,
                    gridLines: {
                        color: "#f3f3f3",
                        drawTicks: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Value"
                    }
                }
            ]
        }
    }
};


class ProductSalesChartCard extends PureComponent {
    
    render() {
        
      return (
         <Card>
            <CardHeader>
               <CardTitle className="mb-0">{this.props.cardTitle}</CardTitle>
            </CardHeader>
            <CardBody className="pt-2 pb-0">
                  <Line height={400} data={this.props.ChartData} options={AreaChartdata.options} />
            </CardBody>
         </Card>
      );
   }
}

ProductSalesChartCard.propTypes = {
   cardTitle: PropTypes.string,
   salesText: PropTypes.string,
   visitText: PropTypes.string,
    productsSalesData: PropTypes.object,
    LegendTitles: PropTypes.object
};

export default ProductSalesChartCard;
