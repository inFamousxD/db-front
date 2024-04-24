import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { CircularProgress } from "@material-ui/core";

const mapStateToProps = state => {
  return {
    checkedOutItems: state.checkedOutItems,
    loggedInUser: state.loggedInUser
  };
};

// This component shows the items user checked out from the cart.
class ConnectedOrder extends Component {
    state = {
        orderHistory: [],
        loading: false
    };
    async fetchData() {
        this.setState({ loading: true });
        let x = [];
        await fetch(`http://localhost:3000/history?orderId=${this.props.loggedInUser.user.userId}`)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            x = data.orders;
            let y = Object.values(x.reduce((acc, order) => {
                if (!acc[order.orderId]) {
                    acc[order.orderId] = {
                        orderId: order.orderId,
                        orderDate: order.orderDate,
                        products: [],
                        totalPrice: order.totalPrice
                    };
                }
                acc[order.orderId].products.push({
                    orderedQuantity: order.orderedQuantity,
                    prodId: order.prodId,
                    productDescription: order.productDescription,
                    productName: order.productName,
                    productPrice: order.productPrice
                });
                return acc;
            }, {}));
            x = y;
        });
        this.setState({ orderHistory: x, loading: false });
        console.log(this.state.orderHistory)
    }
    
    componentDidMount() {
        this.fetchData();
    }
    render() {
            if (this.state.loading) {
                return (
                  <CircularProgress className="circular" />
                );
            } else {
                return (
                <div style={{ padding: 10 }}>
                <div style={{ fontSize: 24, marginTop: 10, marginBottom: 30 }}>
                Order history for { this.props.loggedInUser.user.firstName && this.props.loggedInUser.user.firstName } { this.props.loggedInUser.user.lastName && this.props.loggedInUser.user.lastName }
                </div>
                {
                    this.state.orderHistory.length > 0 && this.state.orderHistory.map(order => {
                        return (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    flexGrow: 1,
                                    justifyContent: 'space-between',
                                    marginTop: '50px'
                                }}>
                                    <div>Order [ID#{order.orderId}]</div>
                                    <div style={{ color: '#aaa' }}> ordered on {Date(order.orderDate)}</div>
                                </div>
                                <Table>
                                <TableHead>
                                    <TableRow>
                                    <TableCell>Product Id</TableCell>
                                    <TableCell>Product name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.products.map(prod => {
                                        return (
                                        <TableRow key={prod.prodId}>
                                            <TableCell width={30}>{prod.prodId}</TableCell>
                                            <TableCell width={100}>{prod.productName}</TableCell>
                                            <TableCell width={30}>{prod.productPrice}</TableCell>
                                            <TableCell width={30}>{prod.orderedQuantity}</TableCell>
                                            <TableCell width={500}>{prod.productDescription}</TableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                                </Table>
                            </div>
                        )
                    })
                }
            </div>
            )
        }
    }
}
const OrderHistory = withRouter(connect(mapStateToProps)(ConnectedOrder));

export default OrderHistory;
